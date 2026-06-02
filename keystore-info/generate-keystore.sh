#!/bin/bash
# =================================================================
# СКРИПТ ГЕНЕРАЦИИ KEYSTORE ДЛЯ GOOGLE PLAY
# Запусти один раз: bash generate-keystore.sh
# Сохрани файл remont-app-release.keystore В НАДЁЖНОМ МЕСТЕ!
# =================================================================

echo ""
echo "=========================================="
echo "  Генерация Keystore для М-Ремонт"
echo "=========================================="
echo ""

# Проверяем, есть ли keytool
if ! command -v keytool &> /dev/null; then
    echo "ОШИБКА: keytool не найден."
    echo "Установи Java JDK: https://adoptium.net/"
    exit 1
fi

# Параметры (можно менять)
KEYSTORE_FILE="remont-app-release.keystore"
ALIAS="remont-key"
VALIDITY=10000   # ~27 лет — Google Play требует минимум до 2033 года

echo "Введи данные для ключа подписи:"
echo "(Эти данные будут вшиты в ключ. Не критично что вводить — главное запомни пароль!)"
echo ""

keytool -genkey -v \
  -keystore "$KEYSTORE_FILE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity "$VALIDITY"

echo ""
echo "=========================================="
echo "  ГОТОВО!"
echo "=========================================="
echo ""
echo "Файл создан: $KEYSTORE_FILE"
echo ""
echo "ВАЖНО — сохрани эти данные в надёжном месте:"
echo "  Файл keystore: $KEYSTORE_FILE"
echo "  Alias: $ALIAS"
echo "  Пароль keystore: (тот что ты ввёл)"
echo "  Пароль ключа: (тот что ты ввёл)"
echo ""
echo "БЕЗ ЭТОГО ФАЙЛА И ПАРОЛЯ ТЫ НЕ СМОЖЕШЬ"
echo "ОБНОВИТЬ ПРИЛОЖЕНИЕ В GOOGLE PLAY!"
echo ""
echo "Положи файл .keystore:"
echo "  - В папку android/app/ своего проекта"
echo "  - Сделай резервную копию на флешку/облако"
echo "  - НИКОГДА не загружай в GitHub!"
echo "=========================================="
