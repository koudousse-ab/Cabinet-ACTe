-- ============================================================
-- Script d'insertion de données de démonstration (corrigé)
-- pour MissionFlow (PostgreSQL)
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- 1. Nettoyer les tables (optionnel – décommentez si besoin)
-- ═══════════════════════════════════════════════════════════════
-- TRUNCATE TABLE notification CASCADE;
-- TRUNCATE TABLE task CASCADE;
-- TRUNCATE TABLE course CASCADE;
-- TRUNCATE TABLE project CASCADE;
-- TRUNCATE TABLE employee CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- 2. Insérer des employés (uniquement ceux qui n'existent pas)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Administrateur', 'admin@cabinet-acte.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'admin@cabinet-acte.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Alice Martin', 'alice@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CHEF_PROJET', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'alice@cabinet.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Bob Dupuis', 'bob@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'bob@cabinet.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Claire Lefevre', 'claire@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'claire@cabinet.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Jean Dupont', 'jean.dupont@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'jean.dupont@cabinet.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Marie Curie', 'marie@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'marie@cabinet.com');

INSERT INTO employee (name, email, password, role, created_at)
SELECT 'Paul Durand', 'paul@cabinet.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EMPLOYE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE email = 'paul@cabinet.com');

-- ═══════════════════════════════════════════════════════════════
-- 3. Insérer des projets (avec vérification d'absence)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Audit financier 2026', 'Groupe Alpha', 'Audit des comptes 2025-2026', 'EN_COURS', '2026-07-01'::date, '2026-08-15'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Audit financier 2026');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Refonte site web', 'Startup Innov', 'Refonte du site vitrine avec e-commerce', 'EN_COURS', '2026-06-15'::date, '2026-07-30'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Refonte site web');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Formation leadership', 'Cabinet RH', 'Formation pour 20 managers', 'TERMINE', '2026-05-01'::date, '2026-06-30'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Formation leadership');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Étude de marché Afrique', 'Export SA', 'Étude pour lancement produit en Afrique', 'EN_ATTENTE', NULL, '2026-09-30'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Étude de marché Afrique');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Migration cloud', 'TechCorp', 'Migration des applications vers AWS', 'ANNULE', '2026-04-01'::date, '2026-06-01'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Migration cloud');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Développement CRM', 'Startup Innov', 'CRM interne pour suivi clients', 'EN_COURS', '2026-07-10'::date, '2026-09-10'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Développement CRM');

INSERT INTO project (name, client, description, status, start_date, end_date, created_at)
SELECT 'Formation Excel', 'Cabinet RH', 'Formation avancée Excel pour analystes', 'TERMINE', '2026-04-10'::date, '2026-05-10'::date, NOW()
WHERE NOT EXISTS (SELECT 1 FROM project WHERE name = 'Formation Excel');

-- ═══════════════════════════════════════════════════════════════
-- 4. Insérer des tâches (avec sous-requêtes pour les IDs)
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
    p_audit BIGINT;      p_web BIGINT;      p_formation BIGINT;
    p_etude BIGINT;      p_migration BIGINT; p_crm BIGINT;      p_excel BIGINT;
    e_alice BIGINT;      e_bob BIGINT;      e_claire BIGINT;
    e_jean BIGINT;       e_marie BIGINT;    e_paul BIGINT;
BEGIN
    SELECT id INTO p_audit FROM project WHERE name = 'Audit financier 2026';
    SELECT id INTO p_web FROM project WHERE name = 'Refonte site web';
    SELECT id INTO p_formation FROM project WHERE name = 'Formation leadership';
    SELECT id INTO p_etude FROM project WHERE name = 'Étude de marché Afrique';
    SELECT id INTO p_migration FROM project WHERE name = 'Migration cloud';
    SELECT id INTO p_crm FROM project WHERE name = 'Développement CRM';
    SELECT id INTO p_excel FROM project WHERE name = 'Formation Excel';

    SELECT id INTO e_alice FROM employee WHERE email = 'alice@cabinet.com';
    SELECT id INTO e_bob FROM employee WHERE email = 'bob@cabinet.com';
    SELECT id INTO e_claire FROM employee WHERE email = 'claire@cabinet.com';
    SELECT id INTO e_jean FROM employee WHERE email = 'jean.dupont@cabinet.com';
    SELECT id INTO e_marie FROM employee WHERE email = 'marie@cabinet.com';
    SELECT id INTO e_paul FROM employee WHERE email = 'paul@cabinet.com';

    -- Audit financier
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Analyse des comptes', 'Examiner les comptes 2025', 'IN_PROGRESS', 'HIGH', p_audit, e_bob, '2026-07-15'::date, 20, 12, NOW(), NOW()),
    ('Rapport préliminaire', 'Rédiger le rapport d''audit', 'TODO', 'MEDIUM', p_audit, e_claire, '2026-07-25'::date, 15, 0, NOW(), NOW()),
    ('Vérification des documents', 'Vérifier les pièces justificatives', 'DONE', 'LOW', p_audit, e_bob, '2026-07-05'::date, 8, 8, NOW(), NOW());

    -- Refonte site web
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Maquettes UI/UX', 'Créer les maquettes des pages principales', 'DONE', 'HIGH', p_web, e_claire, '2026-06-30'::date, 25, 22, NOW(), NOW()),
    ('Intégration frontend', 'Intégrer les maquettes en React', 'IN_PROGRESS', 'HIGH', p_web, e_jean, '2026-07-20'::date, 40, 18, NOW(), NOW()),
    ('Mise en place backend', 'Développer l''API avec Spring Boot', 'TODO', 'MEDIUM', p_web, e_alice, '2026-07-28'::date, 30, 0, NOW(), NOW()),
    ('Tests de performance', 'Effectuer des tests de charge', 'BLOCKED', 'LOW', p_web, e_bob, '2026-07-15'::date, 10, 2, NOW(), NOW());

    -- Formation leadership
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Préparer le support', 'Créer les diapositives et exercices', 'DONE', 'MEDIUM', p_formation, e_claire, '2026-05-20'::date, 12, 12, NOW(), NOW()),
    ('Animer la formation', 'Animer les sessions de formation', 'DONE', 'HIGH', p_formation, e_alice, '2026-06-15'::date, 30, 30, NOW(), NOW()),
    ('Évaluer les participants', 'Faire passer les évaluations finales', 'DONE', 'LOW', p_formation, e_bob, '2026-06-25'::date, 6, 6, NOW(), NOW());

    -- Étude de marché
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Recherche documentaire', 'Collecter les données secondaires', 'TODO', 'MEDIUM', p_etude, e_bob, '2026-08-10'::date, 20, 0, NOW(), NOW()),
    ('Enquête terrain', 'Réaliser des entretiens avec des experts', 'TODO', 'HIGH', p_etude, e_claire, '2026-08-25'::date, 25, 0, NOW(), NOW());

    -- Migration cloud
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Analyse des besoins', 'Identifier les applications à migrer', 'CANCELLED', 'MEDIUM', p_migration, e_alice, '2026-04-10'::date, 10, 3, NOW(), NOW());

    -- Développement CRM
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Spécifications fonctionnelles', 'Rédiger le cahier des charges', 'IN_PROGRESS', 'HIGH', p_crm, e_alice, '2026-07-25'::date, 15, 5, NOW(), NOW()),
    ('Conception base de données', 'Modéliser la structure des données', 'TODO', 'MEDIUM', p_crm, e_marie, '2026-08-05'::date, 10, 0, NOW(), NOW()),
    ('Développement modules', 'Coder les modules principaux', 'TODO', 'HIGH', p_crm, e_jean, '2026-08-20'::date, 40, 0, NOW(), NOW());

    -- Formation Excel
    INSERT INTO task (title, description, status, priority, project_id, assigned_to, due_date, estimated_hours, actual_hours, created_at, updated_at) VALUES
    ('Préparer exercices', 'Créer les fichiers d''exercices', 'DONE', 'LOW', p_excel, e_paul, '2026-04-15'::date, 8, 8, NOW(), NOW()),
    ('Animer la formation', 'Formation en présentiel', 'DONE', 'MEDIUM', p_excel, e_alice, '2026-05-05'::date, 20, 20, NOW(), NOW());

END $$;

-- ═══════════════════════════════════════════════════════════════
-- 5. Insérer des cours (avec cast explicite des dates et heures)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, status, created_at, updated_at)
SELECT 'Gestion de projet agile', 'Introduction aux méthodes agiles (Scrum, Kanban)', '2026-07-27'::date, '2026-07-31'::date, '09:00'::time, id, 'PLANNED', NOW(), NOW()
FROM employee WHERE email = 'jean.dupont@cabinet.com'
AND NOT EXISTS (SELECT 1 FROM course WHERE title = 'Gestion de projet agile');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, status, created_at, updated_at)
SELECT 'Développement Java', 'Approfondissement Spring Boot', '2026-07-20'::date, '2026-07-24'::date, '14:00'::time, id, 'IN_PROGRESS', NOW(), NOW()
FROM employee WHERE email = 'bob@cabinet.com'
AND NOT EXISTS (SELECT 1 FROM course WHERE title = 'Développement Java');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, status, created_at, updated_at)
SELECT 'Data Science', 'Introduction au Machine Learning avec Python', '2026-08-03'::date, '2026-08-07'::date, '10:30'::time, id, 'PLANNED', NOW(), NOW()
FROM employee WHERE email = 'claire@cabinet.com'
AND NOT EXISTS (SELECT 1 FROM course WHERE title = 'Data Science');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, status, created_at, updated_at)
SELECT 'Communication professionnelle', 'Techniques de présentation et rédaction', '2026-06-01'::date, '2026-06-05'::date, '13:00'::time, id, 'COMPLETED', NOW(), NOW()
FROM employee WHERE email = 'marie@cabinet.com'
AND NOT EXISTS (SELECT 1 FROM course WHERE title = 'Communication professionnelle');

INSERT INTO course (title, description, start_date, end_date, start_time, assigned_to, status, created_at, updated_at)
SELECT 'Sécurité informatique', 'Bases de la cybersécurité', '2026-07-26'::date, '2026-07-28'::date, '08:30'::time, id, 'PLANNED', NOW(), NOW()
FROM employee WHERE email = 'paul@cabinet.com'
AND NOT EXISTS (SELECT 1 FROM course WHERE title = 'Sécurité informatique');

-- ═══════════════════════════════════════════════════════════════
-- 6. Insérer des notifications (avec sous-requêtes corrigées)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Une nouvelle tâche vous a été assignée : Analyse des comptes', id, (SELECT id FROM task WHERE title = 'Analyse des comptes'), FALSE, NOW()
FROM employee WHERE email = 'bob@cabinet.com';

INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Votre tâche "Rapport préliminaire" approche de sa date limite.', id, (SELECT id FROM task WHERE title = 'Rapport préliminaire'), FALSE, NOW()
FROM employee WHERE email = 'claire@cabinet.com';

INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Le cours "Gestion de projet agile" commence demain.', id, NULL, FALSE, NOW()
FROM employee WHERE email = 'jean.dupont@cabinet.com';

INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Le projet "Audit financier 2026" a été mis à jour.', id, NULL, TRUE, NOW()
FROM employee WHERE email = 'alice@cabinet.com';

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
