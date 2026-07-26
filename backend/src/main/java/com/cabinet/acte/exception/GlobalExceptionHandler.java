package com.cabinet.acte.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse body = new ErrorResponse(HttpStatus.FORBIDDEN.value(), ex.getMessage(), "Forbidden");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // Conflit d'horaire (ex: enseignant déjà occupé à cette date/heure) -> 409 Conflict
    @ExceptionHandler(TaskException.class)
    public ResponseEntity<ErrorResponse> handleTaskException(TaskException ex) {
        ErrorResponse body = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                "Conflict",
                ex.getErrorCode()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse body = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), "Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Les services lèvent volontairement des RuntimeException avec un message utilisateur
    // (ex: "Cours non trouvé") pour signaler un 404 métier : on garde ce message, il est sûr.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Filet de sécurité : toute erreur non prévue (bug, exception technique) ne doit jamais
    // exposer de détails internes (stack trace, requête SQL, nom de classe...) au client.
    // Le détail complet part dans les logs serveur pour le diagnostic.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Erreur interne non gérée", ex);
        ErrorResponse body = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Une erreur interne est survenue. Veuillez réessayer plus tard.",
                "Internal Server Error"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
