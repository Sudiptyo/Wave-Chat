const passwordResetKey = (tokenHash: string) => `auth:password-reset:${tokenHash}`;

export { passwordResetKey };