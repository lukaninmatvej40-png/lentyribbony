(() => {
  'use strict';
  const panel = document.createElement('dialog');
  panel.className = 'auth-panel';
  panel.setAttribute('aria-labelledby', 'auth-title');
  panel.innerHTML = `<div class="auth-panel__header"><div><span class="auth-panel__eyebrow">Ленты и Риббоны</span><h2 id="auth-title">Вход в аккаунт</h2></div><button class="auth-panel__close" type="button" aria-label="Закрыть панель">×</button></div>
  <div class="auth-panel__body"><div class="auth-panel__tabs" aria-label="Действия с аккаунтом"><button type="button" data-auth-view="login" aria-pressed="true">Вход</button><button type="button" data-auth-view="register" aria-pressed="false">Регистрация</button></div>
  <form class="auth-panel__form" data-auth-form="login"><p>Рады видеть вас снова</p><label for="auth-login">Имя пользователя или email <span>*</span></label><input id="auth-login" name="username" autocomplete="username" required><label for="auth-password">Пароль <span>*</span></label><div class="auth-panel__password"><input id="auth-password" name="password" type="password" autocomplete="current-password" required><button type="button" data-auth-password="auth-password" aria-label="Показать пароль" aria-pressed="false">Показать</button></div><div class="auth-panel__options"><label><input type="checkbox" name="remember"> Запомнить меня</label><button type="button" data-auth-view="reset">Забыли пароль?</button></div><button class="button auth-panel__submit" type="submit">Войти</button></form>
  <form class="auth-panel__form" data-auth-form="register" hidden><p>Создайте аккаунт для удобного оформления заказов.</p><label for="auth-email">Электронная почта <span>*</span></label><input id="auth-email" name="email" type="email" autocomplete="email" required><label for="auth-new-password">Пароль <span>*</span></label><div class="auth-panel__password"><input id="auth-new-password" name="password" type="password" autocomplete="new-password" minlength="8" required aria-describedby="auth-password-hint"><button type="button" data-auth-password="auth-new-password" aria-label="Показать пароль" aria-pressed="false">Показать</button></div><small id="auth-password-hint">Не менее 8 символов</small><label class="auth-panel__consent"><input type="checkbox" required> <span>Я принимаю <a href="privacy.html">политику конфиденциальности</a>.</span></label><button class="button auth-panel__submit" type="submit">Зарегистрироваться</button></form>
  <form class="auth-panel__form" data-auth-form="reset" hidden><p>Укажите почту, которую использовали при регистрации.</p><label for="auth-reset-email">Электронная почта <span>*</span></label><input id="auth-reset-email" name="email" type="email" autocomplete="email" required><button class="button auth-panel__submit" type="submit">Восстановить пароль</button><button class="auth-panel__back" type="button" data-auth-view="login">← Вернуться ко входу</button></form>
  <p class="auth-panel__status" role="status" hidden></p><div class="auth-panel__notice">Демонстрационная версия: вход и регистрация пока не подключены.<a href="https://lentyribbony.ru/my-account/" target="_blank" rel="noopener">Открыть аккаунт на действующем сайте ↗</a></div><div class="auth-panel__footer"><span>Всё для ваших идей</span><p>Ленты · Риббоны · Этикетки</p></div></div>`;
  document.body.append(panel);
  let opener = null;
  let previousOverflow = '';
  const status = panel.querySelector('.auth-panel__status');
  function switchView(view, focus = true) {
    panel.querySelectorAll('[data-auth-form]').forEach(form => { form.hidden = form.dataset.authForm !== view; });
    panel.querySelectorAll('.auth-panel__tabs button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.authView === view)));
    panel.querySelector('#auth-title').textContent = {login:'Вход в аккаунт',register:'Регистрация',reset:'Забыли пароль?'}[view];
    status.hidden = true;
    if (focus) panel.querySelector(`[data-auth-form="${view}"] input`).focus();
  }
  function open(trigger) {
    if (panel.open) return;
    opener = trigger;
    previousOverflow = document.body.style.overflow;
    switchView('login', false);
    panel.showModal();
    document.body.style.overflow = 'hidden';
    panel.querySelector('#auth-login').focus();
  }
  document.querySelectorAll('a[href="account.html"], [data-auth-open]').forEach(link => {
    link.setAttribute('aria-haspopup','dialog');
    link.addEventListener('click', e => {if(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); open(link);});
  });
  panel.querySelector('.auth-panel__close').addEventListener('click', () => panel.close());
  let outsideDown = false;
  panel.addEventListener('pointerdown', e => {const r=panel.getBoundingClientRect();outsideDown=e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom;});
  panel.addEventListener('click', e => {const r=panel.getBoundingClientRect();if(outsideDown && (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)) panel.close();outsideDown=false;});
  panel.addEventListener('close', () => {document.body.style.overflow=previousOverflow;panel.querySelectorAll('input[type="password"],input[name="password"]').forEach(input=>{input.value='';input.type='password';});panel.querySelectorAll('[data-auth-password]').forEach(b=>{b.textContent='Показать';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Показать пароль');});opener?.focus();});
  panel.querySelectorAll('[data-auth-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.authView)));
  panel.querySelectorAll('[data-auth-password]').forEach(button=>button.addEventListener('click',()=>{const input=panel.querySelector('#'+button.dataset.authPassword);const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Скрыть':'Показать';button.setAttribute('aria-pressed',String(show));button.setAttribute('aria-label',show?'Скрыть пароль':'Показать пароль');}));
  panel.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();status.textContent='В демоверсии данные не отправляются. Для входа, регистрации или восстановления пароля перейдите на действующий сайт по ссылке ниже.';status.hidden=false;}));
})();
