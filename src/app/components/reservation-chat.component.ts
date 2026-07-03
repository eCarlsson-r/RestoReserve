import { Component, ElementRef, ViewChild, effect, inject, input, signal } from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../services/api.service";
import { I18nService } from "../services/i18n.service";

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const CONVERSATION_KEY = 'restoreserve_chat_conversation';
const HISTORY_KEY = 'restoreserve_chat_history';

@Component({
  selector: 'app-reservation-chat',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  template: `
    <!-- Floating launcher — sits above the floating nav pill on small screens -->
    <button *ngIf="!open()" (click)="open.set(true)"
            class="fixed bottom-24 lg:bottom-8 right-4 lg:right-6 z-100 flex items-center gap-3 bg-brand-dark text-white pl-5 pr-2 py-2 rounded-full shadow-2xl border border-white/10 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      <span class="text-[10px] font-black uppercase tracking-widest italic">{{ t()('chat.open') }}</span>
      <span class="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-lg">✦</span>
    </button>

    <!-- Chat panel -->
    <div *ngIf="open()" class="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-100 w-[92%] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden flex flex-col" style="height: min(34rem, 75vh)">

        <!-- Header -->
        <div class="bg-brand-dark text-white p-6 flex items-start justify-between">
          <div>
            <h3 class="font-display text-2xl italic leading-none">{{ t()('chat.title') }}</h3>
            <p class="text-[9px] font-black uppercase tracking-widest text-white/40 mt-2">{{ t()('chat.subtitle') }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button (click)="reset()" [title]="t()('chat.newChat')"
                    class="w-8 h-8 rounded-full bg-white/10 text-white/60 text-xs hover:bg-white/20 transition-colors">↺</button>
            <button (click)="open.set(false)"
                    class="w-8 h-8 rounded-full bg-white/10 text-white/60 text-xs hover:bg-white/20 transition-colors">✕</button>
          </div>
        </div>

        <!-- Messages -->
        <div #scroller class="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3 bg-stone-50">
          <div class="flex">
            <div class="max-w-[85%] bg-white border border-stone-100 rounded-3xl rounded-tl-lg px-5 py-3 text-sm text-brand-dark shadow-sm">
              {{ t()('chat.greeting') }}
            </div>
          </div>

          <div *ngFor="let message of messages()" class="flex" [ngClass]="message.role === 'user' ? 'justify-end' : ''">
            <div class="max-w-[85%] px-5 py-3 text-sm shadow-sm whitespace-pre-line"
                 [ngClass]="message.role === 'user'
                   ? 'bg-brand-primary text-white rounded-3xl rounded-tr-lg'
                   : 'bg-white border border-stone-100 text-brand-dark rounded-3xl rounded-tl-lg'">
              {{ message.text }}
            </div>
          </div>

          <div *ngIf="sending()" class="flex">
            <div class="bg-white border border-stone-100 rounded-3xl rounded-tl-lg px-5 py-4 shadow-sm flex gap-1.5">
              <span class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <form (submit)="send($event)" class="p-4 bg-white border-t border-stone-100 flex gap-2">
          <input [(ngModel)]="draft" name="message" [placeholder]="t()('chat.placeholder')" autocomplete="off"
                 class="flex-1 px-5 py-3 rounded-full bg-stone-50 border border-stone-100 text-sm focus:outline-none focus:border-brand-primary/40" />
          <button [disabled]="sending() || !draft.trim()"
                  class="w-12 h-12 shrink-0 bg-brand-primary text-white rounded-full font-black disabled:opacity-30 active:scale-95 transition-all">
            ➤
          </button>
        </form>
      </div>
    </div>
  `
})
export class ReservationChatComponent {
  branchId = input<number>(1);

  private api = inject(ApiService);
  private i18n = inject(I18nService);

  t = this.i18n.t;
  open = signal(false);
  sending = signal(false);
  messages = signal<ChatMessage[]>(this.restoreHistory());
  draft = '';

  private conversationId: string | null =
    typeof window !== 'undefined' ? sessionStorage.getItem(CONVERSATION_KEY) : null;

  @ViewChild('scroller') private scroller?: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      this.messages();
      this.sending();
      queueMicrotask(() => this.scrollToBottom());
    });
  }

  send(event: Event) {
    event.preventDefault();
    const message = this.draft.trim();
    if (!message || this.sending()) return;

    this.draft = '';
    this.messages.update(list => [...list, { role: 'user', text: message }]);
    this.sending.set(true);

    const payload = {
      message,
      branch_id: Number(this.branchId()) || 1,
      date: new Date().toISOString().slice(0, 10),
      conversation_id: this.conversationId
    };

    this.api.post<{ reply: string; conversation_id: string }>('reservation-agent/chat', payload).subscribe({
      next: (res) => {
        this.conversationId = res.conversation_id;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(CONVERSATION_KEY, res.conversation_id);
        }
        this.messages.update(list => [...list, { role: 'assistant', text: res.reply }]);
        this.persistHistory();
        this.sending.set(false);
      },
      error: () => {
        this.messages.update(list => [...list, { role: 'assistant', text: this.t()('chat.error') }]);
        this.sending.set(false);
      }
    });
  }

  reset() {
    this.conversationId = null;
    this.messages.set([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CONVERSATION_KEY);
      sessionStorage.removeItem(HISTORY_KEY);
    }
  }

  private persistHistory() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(this.messages()));
    }
  }

  private restoreHistory(): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private scrollToBottom() {
    const el = this.scroller?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
