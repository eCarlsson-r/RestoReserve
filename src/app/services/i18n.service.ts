import { Injectable, signal, computed } from '@angular/core';

export type Locale = 'en' | 'id';

const STORAGE_KEY = 'restoreserve_locale';

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  en: {
    'nav.menu': 'Menu',
    'nav.callWaiter': 'Call Waiter',
    'nav.goBuffet': 'Go Buffet',
    'nav.search': 'Search',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.login': 'Login',

    'reserve.title': 'Book a Buffet',
    'reserve.datetime': 'Event Date and Time',
    'reserve.pax': 'Guaranteed Pax',
    'reserve.deposit': 'Deposit',
    'reserve.branch': 'Event Branch',
    'reserve.selectBranch': 'Select Branch',
    'reserve.buffet': 'Buffet',
    'reserve.selectBuffet': 'Select Buffet',
    'reserve.notes': 'Notes',
    'reserve.submit': 'Check Availability',
    'reserve.success': 'Reservation successful! See you soon.',
    'reserve.unavailable': 'Check availability for this date.',

    'chat.title': 'RestoReserve Assistant',
    'chat.subtitle': 'Ask about tables, buffets & bookings',
    'chat.placeholder': 'Ask me anything…',
    'chat.greeting': 'Hi! I can check table availability, buffet packages and your reservations. How can I help?',
    'chat.error': 'Sorry, something went wrong. Please try again.',
    'chat.open': 'Chat with us',
    'chat.newChat': 'New chat',

    'common.language': 'Language'
  },
  id: {
    'nav.menu': 'Menu',
    'nav.callWaiter': 'Panggil Pelayan',
    'nav.goBuffet': 'Pilih Buffet',
    'nav.search': 'Cari',
    'nav.cart': 'Keranjang',
    'nav.profile': 'Profil',
    'nav.login': 'Masuk',

    'reserve.title': 'Pesan Buffet',
    'reserve.datetime': 'Tanggal dan Waktu Acara',
    'reserve.pax': 'Jumlah Tamu',
    'reserve.deposit': 'Deposit',
    'reserve.branch': 'Cabang Acara',
    'reserve.selectBranch': 'Pilih Cabang',
    'reserve.buffet': 'Buffet',
    'reserve.selectBuffet': 'Pilih Buffet',
    'reserve.notes': 'Catatan',
    'reserve.submit': 'Cek Ketersediaan',
    'reserve.success': 'Reservasi berhasil! Sampai jumpa.',
    'reserve.unavailable': 'Cek ketersediaan untuk tanggal ini.',

    'chat.title': 'Asisten RestoReserve',
    'chat.subtitle': 'Tanya soal meja, buffet & reservasi',
    'chat.placeholder': 'Tanya apa saja…',
    'chat.greeting': 'Halo! Saya bisa cek ketersediaan meja, paket buffet, dan reservasi Anda. Ada yang bisa dibantu?',
    'chat.error': 'Maaf, terjadi kesalahan. Silakan coba lagi.',
    'chat.open': 'Chat dengan kami',
    'chat.newChat': 'Chat baru',

    'common.language': 'Bahasa'
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly locale = signal<Locale>(this.restore());

  readonly locales: { code: Locale; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'id', label: 'ID' }
  ];

  /** Translate a key in the current locale, falling back to English then the key itself. */
  readonly t = computed(() => {
    const dict = DICTIONARIES[this.locale()];
    return (key: string): string => dict[key] ?? DICTIONARIES.en[key] ?? key;
  });

  setLocale(locale: Locale) {
    this.locale.set(locale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }

  private restore(): Locale {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'id' || saved === 'en' ? saved : 'en';
  }
}
