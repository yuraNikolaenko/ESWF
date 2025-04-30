#!/bin/bash

echo "⚙️ Запуск ініціалізації бази..."
python manage.py shell < init_db_runner.py

echo "🚀 Запуск gunicorn..."
gunicorn backend.wsgi
