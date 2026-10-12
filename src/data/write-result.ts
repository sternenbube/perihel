// What a create or rename returns. Expected failures (duplicate, empty name)
// come back as { ok: false }; everything else is thrown.
export type WriteResult = { ok: true } | { ok: false; error: string };
