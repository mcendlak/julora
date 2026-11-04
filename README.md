# JULORA Sp. z o.o. – strona wizytówka

Statyczna strona (HTML/CSS/JS), gotowa do hostingu na GitHub Pages.

## Do uzupełnienia przed publikacją

- **Telefon / e-mail** – obecnie `+48 123 456 789` i `biuro@julora.pl` (z makiety), w `index.html`.
- **NIP / KRS** – stopka, `index.html`.
- **Klucz formularza** – `WPISZ-KLUCZ-WEB3FORMS` w `index.html` (patrz niżej).
- **Liczby i treści** – sekcja ze statystykami i „Dlaczego my?” – do potwierdzenia z klientem.

## Formularz kontaktowy (Web3Forms)

GitHub Pages nie uruchamia PHP, więc formularz wysyła dane przez Web3Forms:

1. Wejdź na https://web3forms.com, podaj adres e-mail klienta – klucz przyjdzie mailem.
2. Wklej go w `index.html` w polu `<input type="hidden" name="access_key" ...>`.
3. W panelu Web3Forms ogranicz klucz do domeny strony (Domain restriction).

Klucz jest publiczny z założenia (pozwala tylko wysłać wiadomość na przypisany e-mail).
Alternatywa: Formspree – wystarczy zmienić `action` formularza na `https://formspree.io/f/XXXX`.

## Publikacja na GitHub Pages

1. Wrzuć zawartość folderu do repozytorium.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Własna domena: Settings → Pages → Custom domain (np. `julora.pl`), u rejestratora rekordy A na adresy GitHub Pages i CNAME `www` → `<user>.github.io`; zaznacz „Enforce HTTPS”.
