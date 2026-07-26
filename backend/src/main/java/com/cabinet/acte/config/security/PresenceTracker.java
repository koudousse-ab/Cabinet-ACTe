package com.cabinet.acte.config.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Suivi léger de la présence des utilisateurs, en mémoire (pas de table dédiée).
 * Chaque requête authentifiée met à jour le "dernier vu" de l'utilisateur.
 * Note : la liste est réinitialisée à chaque redémarrage du serveur — c'est voulu,
 * il ne s'agit que d'un indicateur de présence temps réel, pas d'un historique.
 */
@Component
public class PresenceTracker {

    private final Map<String, Instant> lastSeenByEmail = new ConcurrentHashMap<>();

    public void touch(String email) {
        lastSeenByEmail.put(email, Instant.now());
    }

    public Map<String, Instant> getAll() {
        return lastSeenByEmail;
    }
}
