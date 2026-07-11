import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'app_language';

 readonly languages = [
    { label: 'English', value: 'en' },      
    { label: 'Français', value: 'fr' },   
    { label: 'Español', value: 'es' },      
    { label: 'Deutsch', value: 'de' },      
    { label: 'Português', value: 'pt' },    
    { label: 'العربية', value: 'ar' },      
    { label: 'हिन्दी', value: 'hi' } 
  ];

constructor() {
    this.translate.addLangs(['en', 'hi', 'es', 'fr', 'de', 'pt', 'ar']);
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'en';
    this.translate.use(this.languages.some(x => x.value === saved) ? saved : 'en');
  }

  get current(): string {
    return this.translate.currentLang?.() ?? this.translate.getCurrentLang() ?? 'en';
  }

  setLanguage(lang: string): void {
    if (!this.languages.some(x => x.value === lang)) return;
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }
}