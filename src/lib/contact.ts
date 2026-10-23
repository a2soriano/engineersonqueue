// Public email fallback. Submission routing is bound to the Web3Forms key below.
export const commissionEmail = 'engineersonqueue@protonmail.com';

// Public browser form key confirmed by the team; this is not a private API token.
// An absent build override uses this default; an explicitly empty override disables it.
export const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? '50d9aa25-8acb-43bd-854e-4c97f39d99bb';
