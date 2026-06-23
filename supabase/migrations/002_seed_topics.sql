-- Seed all 20 topic categories
INSERT INTO topics (slug, name, description, icon_name, color_primary, color_secondary, sort_order) VALUES
  ('culinary-arts',          'Culinary Arts',              'Discover the science and art behind great food',              'restaurant',      '#F97316', '#FED7AA', 0),
  ('automotive',             'Cars & Automotive',          'From engines to EVs — how cars work and why it matters',      'car-sport',       '#6366F1', '#C7D2FE', 1),
  ('space-astronomy',        'Space & Astronomy',          'Explore the cosmos, from our solar system to black holes',    'planet',          '#8B5CF6', '#DDD6FE', 2),
  ('physics',                'Physics',                    'The fundamental laws that govern everything around us',       'flash',           '#3B82F6', '#BFDBFE', 3),
  ('chemistry',              'Chemistry',                  'Atoms, reactions, and the building blocks of matter',         'flask',           '#10B981', '#A7F3D0', 4),
  ('biology',                'Biology',                    'Life itself — from cells to ecosystems',                      'leaf',            '#22C55E', '#BBF7D0', 5),
  ('psychology-social',      'Psychology & Social Skills', 'Understand yourself and connect better with others',          'people',          '#EC4899', '#FBCFE8', 6),
  ('history',                'History',                    'The events and people that shaped our world',                 'time',            '#B45309', '#FDE68A', 7),
  ('engineering',            'Engineering',                'From structures to machines — the principles of applied science', 'cog', '#6B7280', '#D1D5DB', 8),
  ('software',               'Software',                   'How software systems, AI, and the internet work',              'at-outline',      '#06B6D4', '#A5F3FC', 9),
  ('coding',                 'Coding',                     'Programming languages and the art of writing code',            'code',            '#0891B2', '#A5F3FC', 10),
  ('art-design',             'Art & Design',               'Color, form, and creativity — the principles of visual art', 'color-palette',   '#F43F5E', '#FECDD3', 11),
  ('music',                  'Music',                      'Theory, history, and the science of sound',                   'musical-notes',   '#A855F7', '#E9D5FF', 12),
  ('sports-fitness',         'Sports & Fitness',           'The science of movement, training, and peak performance',     'fitness',         '#EF4444', '#FECACA', 13),
  ('nature-environment',     'Nature & Environment',       'Biodiversity, climate, and the living planet',                'earth',           '#16A34A', '#BBF7D0', 14),
  ('finance-economics',      'Finance & Economics',        'Money, markets, and how economies actually function',         'trending-up',     '#EAB308', '#FEF08A', 15),
  ('philosophy',             'Philosophy',                 'Big questions, logical thinking, and the examined life',      'book',            '#64748B', '#CBD5E1', 16),
  ('languages-linguistics',  'Languages & Linguistics',    'How language works, where words come from, why it matters',  'chatbubbles',     '#0EA5E9', '#BAE6FD', 17),
  ('health-wellness',        'Health & Wellness',          'Human anatomy, nutrition, sleep, and mental well-being',      'heart',           '#F87171', '#FECACA', 18),
  ('geography-travel',       'Geography & Travel',         'Cultures, landscapes, and the geopolitics of our world',      'map',             '#FB923C', '#FED7AA', 19);

-- ============================================================
-- Sub-topics for each category
-- ============================================================

-- Culinary Arts
WITH t AS (SELECT id FROM topics WHERE slug = 'culinary-arts')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'flavor-science',     'Flavor Science & Pairing',  'Why certain flavors work together',              0),
  ((SELECT id FROM t), 'cooking-techniques', 'Cooking Techniques',        'Master the core methods of cooking',             1),
  ((SELECT id FROM t), 'world-cuisines',     'World Cuisines',             'A tour of global food cultures and traditions',  2),
  ((SELECT id FROM t), 'baking-pastry',      'Baking & Pastry',           'The precise science behind baking',              3);

-- Cars & Automotive
WITH t AS (SELECT id FROM topics WHERE slug = 'automotive')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'how-engines-work',  'How Engines Work',         'Internal combustion and beyond',                 0),
  ((SELECT id FROM t), 'ev-future-tech',    'EV & Future Tech',         'Electric vehicles and what is coming next',      1),
  ((SELECT id FROM t), 'racing-performance','Racing & Performance',     'Speed, aerodynamics, and motorsport',            2),
  ((SELECT id FROM t), 'car-history',       'Car History & Culture',    'The machines and moments that defined driving',  3);

-- Space & Astronomy
WITH t AS (SELECT id FROM topics WHERE slug = 'space-astronomy')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'solar-system',      'Solar System',             'Our cosmic neighborhood',                        0),
  ((SELECT id FROM t), 'stars-galaxies',    'Stars & Galaxies',         'Life cycles of stars and the structure of galaxies', 1),
  ((SELECT id FROM t), 'black-holes',       'Black Holes & Cosmology',  'Extreme objects and the origin of the universe', 2),
  ((SELECT id FROM t), 'space-exploration', 'Space Exploration',        'Missions, rockets, and humanity in space',       3);

-- Physics
WITH t AS (SELECT id FROM topics WHERE slug = 'physics')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'mechanics-motion',  'Mechanics & Motion',       'Forces, energy, and how things move',            0),
  ((SELECT id FROM t), 'thermodynamics',    'Thermodynamics',           'Heat, entropy, and the laws of energy',          1),
  ((SELECT id FROM t), 'quantum-mechanics', 'Quantum Mechanics',        'The weird world at the smallest scales',         2),
  ((SELECT id FROM t), 'electromagnetism',  'Electromagnetism',         'Fields, waves, and the nature of light',         3);

-- Chemistry
WITH t AS (SELECT id FROM topics WHERE slug = 'chemistry')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'elements-periodic', 'Elements & Periodic Table','Atoms, elements, and the table that organizes them', 0),
  ((SELECT id FROM t), 'chemical-reactions','Chemical Reactions',       'How substances transform and combine',           1),
  ((SELECT id FROM t), 'organic-chemistry', 'Organic Chemistry',        'Carbon compounds and the chemistry of life',     2),
  ((SELECT id FROM t), 'materials-science', 'Materials Science',        'Metals, polymers, and engineered materials',     3);

-- Biology
WITH t AS (SELECT id FROM topics WHERE slug = 'biology')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'cell-biology',  'Cell Biology',           'The fundamental unit of life',                   0),
  ((SELECT id FROM t), 'genetics-dna',  'Genetics & DNA',         'Heredity, genes, and the code of life',          1),
  ((SELECT id FROM t), 'evolution',     'Evolution',              'How life changes over time',                     2),
  ((SELECT id FROM t), 'ecology',       'Ecology & Ecosystems',   'How living things interact with their world',    3);

-- Psychology & Social Skills
WITH t AS (SELECT id FROM topics WHERE slug = 'psychology-social')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'cognitive-biases',   'Cognitive Biases',          'The mental shortcuts that fool us',             0),
  ((SELECT id FROM t), 'emotional-intelligence','Emotional Intelligence', 'Understanding and managing emotions',           1),
  ((SELECT id FROM t), 'social-dynamics',    'Social Dynamics',           'How groups and relationships work',             2),
  ((SELECT id FROM t), 'mental-health',      'Mental Health Basics',      'Foundations of psychological well-being',       3);

-- History
WITH t AS (SELECT id FROM topics WHERE slug = 'history')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'ancient-civilizations','Ancient Civilizations',   'Egypt, Rome, Greece, and the ancient world',   0),
  ((SELECT id FROM t), 'medieval-renaissance', 'Medieval & Renaissance',  'The Middle Ages through the Renaissance',       1),
  ((SELECT id FROM t), 'modern-history',       'Modern History',          'From the Industrial Revolution to WWII',        2),
  ((SELECT id FROM t), 'contemporary-world',   'Contemporary World',      'The world from 1945 to today',                  3);

-- Engineering
WITH t AS (SELECT id FROM topics WHERE slug = 'engineering')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'civil-infrastructure','Civil & Infrastructure',   'Roads, bridges, buildings, and urban systems',   0),
  ((SELECT id FROM t), 'mechanical-engineering','Mechanical Engineering', 'Machines, engines, and mechanical systems',    1),
  ((SELECT id FROM t), 'electrical-engineering','Electrical Engineering', 'Power, circuits, and electromagnetic systems',  2),
  ((SELECT id FROM t), 'materials-engineering','Materials Engineering',  'How materials are engineered and optimized',    3);

-- Software
WITH t AS (SELECT id FROM topics WHERE slug = 'software')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'how-internet-works', 'How the Internet Works',   'Networks, protocols, and the web',              0),
  ((SELECT id FROM t), 'ai-machine-learning', 'AI & Machine Learning',   'How machines learn and what it means',          1),
  ((SELECT id FROM t), 'cybersecurity',       'Cybersecurity',           'Protecting systems and understanding threats',   2),
  ((SELECT id FROM t), 'software-architecture','Software Architecture',   'Systems design and scalable applications',       3);

-- Coding
WITH t AS (SELECT id FROM topics WHERE slug = 'coding')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'programming-concepts','Programming Concepts',    'Variables, functions, and programming logic',   0),
  ((SELECT id FROM t), 'data-structures',     'Data Structures',         'Arrays, trees, graphs, and algorithms',         1),
  ((SELECT id FROM t), 'web-development',     'Web Development',         'HTML, CSS, JavaScript, and web frameworks',     2),
  ((SELECT id FROM t), 'mobile-gamedev',      'Mobile & Game Dev',       'Building apps and games for mobile platforms',  3);

-- Art & Design
WITH t AS (SELECT id FROM topics WHERE slug = 'art-design')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'color-theory',     'Color Theory',              'How color works and why it matters',             0),
  ((SELECT id FROM t), 'art-history',      'Art History Movements',     'From Renaissance to contemporary art',           1),
  ((SELECT id FROM t), 'design-principles','Design Principles',         'Layout, hierarchy, and visual communication',    2),
  ((SELECT id FROM t), 'digital-art',      'Digital Art & Media',       'Creating and understanding digital visuals',     3);

-- Music
WITH t AS (SELECT id FROM topics WHERE slug = 'music')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'music-theory',      'Music Theory',              'Notes, scales, chords, and rhythm',             0),
  ((SELECT id FROM t), 'instruments',       'Instruments & Orchestration','The sounds of each instrument family',         1),
  ((SELECT id FROM t), 'music-history',     'Music History & Genres',    'From classical to hip-hop and everything between', 2),
  ((SELECT id FROM t), 'music-production',  'Production & Recording',    'How music is made in the studio',               3);

-- Sports & Fitness
WITH t AS (SELECT id FROM topics WHERE slug = 'sports-fitness')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'sports-science',   'Sports Science & Biomechanics','How the body moves and performs',            0),
  ((SELECT id FROM t), 'training-nutrition','Training & Nutrition',      'Building fitness and fueling performance',      1),
  ((SELECT id FROM t), 'sports-history',   'Sports History & Culture',  'The moments and athletes that defined sports',  2),
  ((SELECT id FROM t), 'mind-performance', 'Mind & Performance',        'Psychology, focus, and mental toughness',       3);

-- Nature & Environment
WITH t AS (SELECT id FROM topics WHERE slug = 'nature-environment')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'climate-weather',   'Climate & Weather',         'Atmosphere, weather systems, and climate change', 0),
  ((SELECT id FROM t), 'biodiversity',      'Biodiversity',              'The variety of life on Earth and why it matters', 1),
  ((SELECT id FROM t), 'ocean-marine',      'Ocean & Marine Life',       'The deep sea and the creatures within it',      2),
  ((SELECT id FROM t), 'environmental-science','Environmental Science',  'Human impact and paths to sustainability',      3);

-- Finance & Economics
WITH t AS (SELECT id FROM topics WHERE slug = 'finance-economics')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'personal-finance',  'Personal Finance',          'Budgeting, saving, and building wealth',        0),
  ((SELECT id FROM t), 'markets-investing', 'Markets & Investing',       'Stocks, bonds, and how markets work',           1),
  ((SELECT id FROM t), 'economic-theory',   'Economic Theory',           'Supply, demand, and macroeconomic models',      2),
  ((SELECT id FROM t), 'global-economics',  'Global Economics',          'Trade, currencies, and the world economy',      3);

-- Philosophy
WITH t AS (SELECT id FROM topics WHERE slug = 'philosophy')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'ancient-philosophy','Ancient Philosophy',        'Socrates, Plato, Aristotle, and the Stoics',    0),
  ((SELECT id FROM t), 'ethics-morality',   'Ethics & Morality',         'How to think about right and wrong',            1),
  ((SELECT id FROM t), 'logic-thinking',    'Logic & Critical Thinking', 'Arguments, fallacies, and clear reasoning',     2),
  ((SELECT id FROM t), 'philosophy-of-mind','Philosophy of Mind',        'Consciousness, identity, and what it means to think', 3);

-- Languages & Linguistics
WITH t AS (SELECT id FROM topics WHERE slug = 'languages-linguistics')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'how-language-works','How Language Works',        'Phonology, syntax, and the structure of language', 0),
  ((SELECT id FROM t), 'world-languages',   'World Languages Overview',  'The diversity of human languages',              1),
  ((SELECT id FROM t), 'etymology',         'Etymology & Word Origins',  'Where words come from and how they change',     2),
  ((SELECT id FROM t), 'communication-science','Communication Science',  'How we understand and misunderstand each other',3);

-- Health & Wellness
WITH t AS (SELECT id FROM topics WHERE slug = 'health-wellness')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'human-anatomy',    'Human Anatomy',              'How the body is structured and functions',      0),
  ((SELECT id FROM t), 'nutrition-science','Nutrition Science',          'Food, metabolism, and what your body needs',    1),
  ((SELECT id FROM t), 'sleep-recovery',   'Sleep & Recovery',           'Why rest is as important as training',          2),
  ((SELECT id FROM t), 'mental-wellness',  'Mental Wellness',            'Stress, resilience, and emotional health',      3);

-- Geography & Travel
WITH t AS (SELECT id FROM topics WHERE slug = 'geography-travel')
INSERT INTO sub_topics (topic_id, slug, name, description, sort_order) VALUES
  ((SELECT id FROM t), 'physical-geography','Physical Geography',        'Landforms, oceans, and natural features',       0),
  ((SELECT id FROM t), 'world-cultures',    'World Cultures',            'Traditions, languages, and ways of life',       1),
  ((SELECT id FROM t), 'geopolitics',       'Geopolitics',               'Power, borders, and international relations',   2),
  ((SELECT id FROM t), 'natural-wonders',   'Natural Wonders',           'The most spectacular places on Earth',          3);
