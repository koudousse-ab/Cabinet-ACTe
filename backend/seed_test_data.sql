-- =====================================================================
-- SCRIPT DE CHARGEMENT DE DONNÉES DE TEST — MissionFlow
-- =====================================================================
-- Utilisation :
--   1) Démarrer le backend au moins une fois (Hibernate crée les tables
--      grâce à spring.jpa.hibernate.ddl-auto=update), puis l'arrêter.
--   2) Charger ce script dans la base "mission_flow" :
--        psql -U postgres -d mission_flow -f seed_test_data.sql
--      (adapter -U / -d si vos identifiants sont différents de ceux
--       d'application.properties)
--   3) Redémarrer le backend.
--
-- Le script est rejouable sans dupliquer les données (ON CONFLICT /
-- WHERE NOT EXISTS), vous pouvez donc le relancer si besoin.
--
-- Comptes créés (mot de passe entre parenthèses) :
--   admin@cabinet-acte.com     (admin123)   -> ADMIN (déjà créé par l'appli au 1er démarrage)
--   chef@men.tg                (chef123)    -> CHEF_PROJET
--   prof.akakpo@men.tg         (prof123)    -> ENSEIGNANT
--   prof.mensah@men.tg         (prof123)    -> ENSEIGNANT
--   prof.dosseh@men.tg         (prof123)    -> ENSEIGNANT
--   etu1@men.tg ... etu6@men.tg (etu123)    -> ÉTUDIANT (cours Formation DevOps / Formation Cybersécurité)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENSEIGNANTS (admin / chef de projet / enseignants)
-- ---------------------------------------------------------------------
INSERT INTO enseignant (name, email, role, password, created_at)
VALUES ('Administrateur', 'admin@cabinet-acte.com', 'ADMIN',
        '$2b$10$JWrL0pvp/FdYveocPbzkLubTZO2gsk8EUJpWfhzd2mWg1xUJeZ9Ky', now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO enseignant (name, email, role, password, created_at)
VALUES ('Kodjo AGBOZO', 'chef@men.tg', 'CHEF_PROJET',
        '$2b$10$GAfe2xA18TyPnReS8rTaOe97D/51BnyfxEvQM4uhz9HdXxZrrE9bG', now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO enseignant (name, email, role, password, created_at) VALUES
  ('Ama AKAKPO',  'prof.akakpo@men.tg', 'ENSEIGNANT', '$2b$10$fMRSzKJ0Yh07UsOOBDyJ9u.KOFLrfLGlMXVk3i2XFXoa7LvdPLx3G', now()),
  ('Kossi MENSAH','prof.mensah@men.tg', 'ENSEIGNANT', '$2b$10$fMRSzKJ0Yh07UsOOBDyJ9u.KOFLrfLGlMXVk3i2XFXoa7LvdPLx3G', now()),
  ('Afi DOSSEH',  'prof.dosseh@men.tg', 'ENSEIGNANT', '$2b$10$fMRSzKJ0Yh07UsOOBDyJ9u.KOFLrfLGlMXVk3i2XFXoa7LvdPLx3G', now())
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. ÉTUDIANTS (2 cours : Formation DevOps, Formation Cybersécurité)
-- ---------------------------------------------------------------------
INSERT INTO etudiant (name, email, password, classe, created_at) VALUES
  ('Yawa KUMOJI',   'etu1@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation DevOps', now()),
  ('Komi TCHALLA',  'etu2@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation DevOps', now()),
  ('Essi BAKPESSI', 'etu3@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation DevOps', now()),
  ('Kwami SEDDOH',  'etu4@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation Cybersécurité', now()),
  ('Adjo BALOUKI',  'etu5@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation Cybersécurité', now()),
  ('Yao GNASSINGBE','etu6@men.tg', '$2b$10$qTP6DP1x2A9IwdUQQf.vMe1RA0/D5JEZS1YHvRKP./6iH24AgnVcO', 'Formation Cybersécurité', now())
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------
-- 3. PROJETS
-- ---------------------------------------------------------------------
INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Refonte Portail Scolarité', 'Ministère de l''Éducation Nationale',
       'Modernisation du portail de gestion des inscriptions et bulletins.',
       'EN_COURS', CURRENT_DATE - INTERVAL '10 day', CURRENT_DATE + INTERVAL '50 day', now()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Refonte Portail Scolarité');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Application Mobile Enseignants', 'MEN - Direction du Numérique',
       'App mobile pour la saisie des notes et la consultation des emplois du temps.',
       'EN_ATTENTE', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 day', now()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Application Mobile Enseignants');

-- ---------------------------------------------------------------------
-- 4. TÂCHES (liées aux projets + enseignants ci-dessus)
-- ---------------------------------------------------------------------
INSERT INTO task (title, description, status, priority, project_id, assigned_to, scheduled_time, due_date, estimated_hours, actual_hours, created_at, updated_at)
SELECT 'Maquette page inscription', 'Créer les wireframes de la page d''inscription en ligne',
       'IN_PROGRESS', 'HIGH',
       (SELECT id FROM project WHERE name = 'Refonte Portail Scolarité'),
       (SELECT id FROM enseignant WHERE email = 'prof.akakpo@men.tg'),
       '09:00:00', CURRENT_DATE + INTERVAL '3 day', 8, 3, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Maquette page inscription');

INSERT INTO task (title, description, status, priority, project_id, assigned_to, scheduled_time, due_date, estimated_hours, actual_hours, created_at, updated_at)
SELECT 'Intégration API notes', 'Connecter le module de saisie des notes à l''API existante',
       'TODO', 'MEDIUM',
       (SELECT id FROM project WHERE name = 'Refonte Portail Scolarité'),
       (SELECT id FROM enseignant WHERE email = 'prof.mensah@men.tg'),
       '14:00:00', CURRENT_DATE + INTERVAL '7 day', 12, 0, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Intégration API notes');

INSERT INTO task (title, description, status, priority, project_id, assigned_to, scheduled_time, due_date, estimated_hours, actual_hours, created_at, updated_at)
SELECT 'Tests utilisateurs', 'Organiser une session de tests avec 5 enseignants pilotes',
       'TODO', 'LOW',
       (SELECT id FROM project WHERE name = 'Application Mobile Enseignants'),
       (SELECT id FROM enseignant WHERE email = 'prof.dosseh@men.tg'),
       '10:30:00', CURRENT_DATE + INTERVAL '14 day', 6, 0, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Tests utilisateurs');

INSERT INTO task (title, description, status, priority, project_id, assigned_to, scheduled_time, due_date, estimated_hours, actual_hours, created_at, updated_at)
SELECT 'Rapport d''avancement mensuel', 'Rédiger le rapport à transmettre à la Direction du Numérique',
       'REVIEW', 'MEDIUM',
       (SELECT id FROM project WHERE name = 'Refonte Portail Scolarité'),
       (SELECT id FROM enseignant WHERE email = 'prof.akakpo@men.tg'),
       '16:00:00', CURRENT_DATE + INTERVAL '1 day', 4, 4, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM task WHERE title = 'Rapport d''avancement mensuel');

-- ---------------------------------------------------------------------
-- 5. COURS (liés aux enseignants + cours des étudiants)
-- ---------------------------------------------------------------------
INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, classe, status, created_at, updated_at)
SELECT 'Algorithmique - Chapitre 3', 'Salle B12 - Structures de données',
       CURRENT_DATE + INTERVAL '2 day', CURRENT_DATE + INTERVAL '2 day', '08:00:00',
       (SELECT id FROM enseignant WHERE email = 'prof.akakpo@men.tg'), 'Formation DevOps', 'PLANNED', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM course WHERE title = 'Algorithmique - Chapitre 3');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, classe, status, created_at, updated_at)
SELECT 'Réseaux - TP VLAN', 'Salle Info 2 - Cisco Packet Tracer',
       CURRENT_DATE + INTERVAL '2 day', CURRENT_DATE + INTERVAL '2 day', '10:00:00',
       (SELECT id FROM enseignant WHERE email = 'prof.mensah@men.tg'), 'Formation Cybersécurité', 'PLANNED', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM course WHERE title = 'Réseaux - TP VLAN');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, classe, status, created_at, updated_at)
SELECT 'Base de données - Modélisation', 'Salle B12 - Modèle relationnel',
       CURRENT_DATE + INTERVAL '4 day', CURRENT_DATE + INTERVAL '4 day', '09:00:00',
       (SELECT id FROM enseignant WHERE email = 'prof.dosseh@men.tg'), 'Formation DevOps', 'PLANNED', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM course WHERE title = 'Base de données - Modélisation');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, classe, status, created_at, updated_at)
SELECT 'Sécurité réseau', 'Salle Info 2 - Pare-feu et VPN',
       CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '5 day', '14:00:00',
       (SELECT id FROM enseignant WHERE email = 'prof.mensah@men.tg'), 'Formation Cybersécurité', 'PLANNED', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM course WHERE title = 'Sécurité réseau');

-- ---------------------------------------------------------------------
-- Vérification rapide
-- ---------------------------------------------------------------------
SELECT 'enseignant' AS table_name, count(*) FROM enseignant
UNION ALL SELECT 'etudiant', count(*) FROM etudiant
UNION ALL SELECT 'project', count(*) FROM project
UNION ALL SELECT 'task', count(*) FROM task
UNION ALL SELECT 'course', count(*) FROM course;
