-- Удаляем таблицы, если они уже существуют (для удобства при повторном запуске скрипта)
DROP TABLE IF EXISTS clothing_item_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS outfit_set_items CASCADE;
DROP TABLE IF EXISTS outfit_sets CASCADE;
DROP TABLE IF EXISTS user_closet CASCADE;
DROP TABLE IF EXISTS clothing_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL, -- Уникальное имя пользователя для входа
    email VARCHAR(255) UNIQUE NOT NULL,   -- Уникальный email
    password_hash VARCHAR(255) NOT NULL,  -- Хеш пароля (никогда не храним пароль в открытом виде!)
    display_name VARCHAR(100),            -- Отображаемое имя (может быть не уникальным)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Триггер для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- 2. Таблица тегов (категории, типы, стили и т.д.)
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- Например: "T-Shirt", "Pants", "Hoodie", "Summer", "Cotton", "Formal"
    type VARCHAR(50) -- Опционально, для группировки тегов (например: "category", "season", "material", "style")
);

-- Заполним предварительно некоторыми типами одежды (которые были в CLOTH_TYPES)
INSERT INTO tags (name, type) VALUES
    ('T-Shirt', 'category'),
    ('Pants', 'category'),
    ('Hoodie', 'category'),
    ('Jacket', 'category'),
    ('Dress', 'category'),
    ('Shoes', 'category'),
    ('Accessory', 'category'),
    ('Cap', 'category'), -- Добавил, так как упоминалось
    ('Upper Body', 'group'), -- Группа для "Верхняя одежда"
    ('Lower Body', 'group'), -- Группа для "Нижняя одежда"
    ('Outerwear', 'group'),  -- Группа для "Верхний слой" (куртки, пальто)
    ('Footwear', 'group'),
    ('Headwear', 'group');
    -- Можно добавить сезоны, материалы и т.д.


-- 3. Таблица предметов одежды (глобальная, если одежда может быть шаблонной, или принадлежащая пользователю, если каждый грузит свое уникальное)
-- Если мы предполагаем, что пользователи загружают СВОЮ одежду, которая УНИКАЛЬНА для них,
-- то эта таблица может быть не нужна, а `user_closet` будет содержать все детали об одежде.
-- Но для большей гибкости (например, если бы у нас были общие шаблоны одежды) создадим ее.
-- Если каждая загруженная вещь уникальна и не будет использоваться другими пользователями как шаблон,
-- то можно было бы user_id сразу поместить сюда. Но для начала сделаем более общую `clothing_items`.

CREATE TABLE clothing_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), -- Название, которое дает пользователь или генерируется
    description TEXT,
    image_url TEXT NOT NULL,         -- URL к изображению на файловой системе/в облаке
    thumbnail_url TEXT,              -- URL к уменьшенной копии (опционально)
    color VARCHAR(50),               -- Основной цвет
    created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Кто изначально загрузил (если это важно)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_clothing_items
BEFORE UPDATE ON clothing_items
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- 4. Связующая таблица для гардероба пользователя (многие-ко-многим: пользователь - предмет одежды)
-- Или, если каждая вещь принадлежит ТОЛЬКО одному пользователю, то это более простая таблица, 
-- которая хранит экземпляры одежды пользователя, со ссылкой на clothing_items если есть шаблоны,
-- или все детали одежды прямо здесь, если шаблонов нет.

-- Вариант А: Каждая вещь принадлежит ОДНОМУ пользователю. Это проще для начала.
-- `user_id` будет в `clothing_items`, а `clothing_items` - это и есть гардероб.

-- Вариант Б: (который реализуем здесь) Вещи могут быть шаблонными, или мы хотим хранить в user_closet "экземпляры" одежды,
-- которые пользователь добавил в свой гардероб, даже если сама вещь (картинка, базовое описание) может быть "шаблоном".
-- Если же КАЖДАЯ загруженная вещь 100% уникальна и принадлежит только одному пользователю, 
-- то проще добавить user_id прямо в `clothing_items` и убрать `user_closet` (или сделать ее очень простой).

-- Для текущего сценария (пользователь загружает СВОИ фото одежды):
-- Лучше всего добавить `user_id` напрямую в `clothing_items`. Это делает ее персональным гардеробом.
-- Переопределим `clothing_items` для этого сценария:

DROP TABLE IF EXISTS clothing_items CASCADE;
CREATE TABLE clothing_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Каждая вещь принадлежит конкретному пользователю
    name VARCHAR(255),             -- Название, которое дает пользователь или генерируется
    description TEXT,
    image_url TEXT NOT NULL,       -- URL к изображению
    thumbnail_url TEXT,            -- URL к уменьшенной копии
    primary_color VARCHAR(50),
    secondary_color VARCHAR(50),
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- Здесь можно добавить другие атрибуты: brand, material, season_appropriateness и т.д.
);

CREATE TRIGGER set_timestamp_clothing_items_user_specific
BEFORE UPDATE ON clothing_items
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- 5. Связующая таблица для тегов одежды (многие-ко-многим: clothing_item - tag)
CREATE TABLE clothing_item_tags (
    clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (clothing_item_id, tag_id) -- Составной первичный ключ
);


-- 6. Таблица наборов/сетов одежды
CREATE TABLE outfit_sets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Пользователь, создавший сет
    name VARCHAR(255) NOT NULL,         -- Название сета (например, "Летний образ для прогулки")
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_outfit_sets
BEFORE UPDATE ON outfit_sets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- 7. Связующая таблица для предметов одежды в наборе (многие-ко-многим: outfit_set - clothing_item)
CREATE TABLE outfit_set_items (
    outfit_set_id INTEGER NOT NULL REFERENCES outfit_sets(id) ON DELETE CASCADE,
    clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_set_id, clothing_item_id)
);

-- Пример того, как могли бы выглядеть рекомендации от AI (можно будет добавить позже)
-- CREATE TABLE ai_recommendations (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     recommended_outfit_set_id INTEGER REFERENCES outfit_sets(id) ON DELETE SET NULL, -- Если рекомендуем сет
--     -- или список отдельных clothing_item_ids, если сет не создается автоматически
--     weather_conditions JSONB, -- С какими погодными условиями связана рекомендация
--     reason TEXT, -- Почему AI это порекомендовал
--     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );

COMMENT ON COLUMN users.password_hash IS 'Хранится хеш пароля, созданный с использованием bcrypt или argon2';
COMMENT ON COLUMN clothing_items.image_url IS 'URL к изображению, хранящемуся на сервере или в облаке';
COMMENT ON TABLE tags IS 'Хранит все возможные теги для классификации одежды';
COMMENT ON TABLE clothing_items IS 'Каждый предмет одежды, загруженный пользователем в его гардероб';
COMMENT ON TABLE clothing_item_tags IS 'Связывает одежду с ее тегами (категория, цвет, сезон и т.д.)';
COMMENT ON TABLE outfit_sets IS 'Наборы одежды, созданные пользователями';
COMMENT ON TABLE outfit_set_items IS 'Связывает конкретные предметы одежды с наборами';