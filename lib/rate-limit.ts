const lastCallByUser = new Map<string, number>();

/**
 * Limite in-memory: vive nella RAM del processo server.
 * Funziona bene in locale o su un server sempre acceso, ma su Vercel
 * (funzioni serverless, istanze multiple) ogni istanza ha la sua Map
 * separata, quindi il limite potrebbe non essere rispettato al 100%
 * tra richieste consecutive gestite da istanze diverse.
 * 
 * Miglioria futura: spostare lo stato su un DB (o Redis/Upstash) condiviso
 * tra tutte le istanze, per garantire un rate limiting solido in produzione.
 */

export function isRateLimited(userId: string, minIntervalMs: number): boolean {
    const now = Date.now();
    const last = lastCallByUser.get(userId);

    if (last !== undefined && now - last < minIntervalMs) {
        return true;
    }

    lastCallByUser.set(userId, now);
    return false;
}