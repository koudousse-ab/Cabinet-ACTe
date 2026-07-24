-- ═══════════════════════════════════════════════════════════════
-- Corriger les notifications en ajoutant LIMIT 1
-- ═══════════════════════════════════════════════════════════════

DELETE FROM notification WHERE message LIKE '%Analyse des comptes%' OR message LIKE '%Rapport préliminaire%';

INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Une nouvelle tâche vous a été assignée : Analyse des comptes', id, (SELECT id FROM task WHERE title = 'Analyse des comptes' LIMIT 1), FALSE, NOW()
FROM employee WHERE email = 'bob@cabinet.com';

INSERT INTO notification (message, employee_id, task_id, is_read, created_at)
SELECT 'Votre tâche "Rapport préliminaire" approche de sa date limite.', id, (SELECT id FROM task WHERE title = 'Rapport préliminaire' LIMIT 1), FALSE, NOW()
FROM employee WHERE email = 'claire@cabinet.com';
