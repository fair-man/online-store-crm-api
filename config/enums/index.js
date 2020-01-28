var Enums = {
  rcs: {},
  codes: {}
};

Enums.rcs[0] = 'Ok';
Enums.rcs[21] = 'На указанный e-mail уже зарегистрирован аккаунт.';
Enums.rcs[22] = 'Неправильный e-mail или пароль.';
Enums.rcs[23] = 'Аккаунт заблокирован';
Enums.rcs[24] = 'Ошибка сервера, письмо не отправлено';
Enums.rcs[25] = 'Неверный текущий пароль или пароли не совпадают.';
Enums.rcs[26] = 'Текущий пароль успешно обновлен.';

Enums.rcs[400] = 'Bad request';
Enums.rcs[401] = 'Not authorized';
Enums.rcs[403] = 'Forbidden';
Enums.rcs[500] = 'Internal server error';

Enums.codes.SUCCESS = 200;
Enums.codes.BAD_REQUEST = 400;
Enums.codes.NOT_AUTHORIZED = 401;
Enums.codes.FORBIDDEN = 403;
Enums.codes.BACKEND_ERROR = 500;

module.exports = Enums;
