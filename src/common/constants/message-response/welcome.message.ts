export const welcomeMessage = async (code: number, username?: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #cca300; font-weight: bold; font-size: 24px; margin-bottom: 20px;">Congratulations, ${username}!</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        You just signed up on Event-Drive!
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Use the code below to verify your email address:
      </p>
      <div style="font-size: 18px; font-weight: bold; color: #333; background-color: #f8f8f8; padding: 10px; text-align: center; margin-top: 20px;">
        ${code}
      </div>
      <p style="font-size: 16px; line-height: 1.5; color: #333; margin-top: 20px;">
        <strong>Note:</strong> If you did not request this sign-up, you can safely ignore this email.
      </p>
    </div>
  `;
};

export const resetPasswordMessage = async (username: string, code: number) => {
  return `Hello ${username}. You request to reset your password. Use the code below to activate your action ${code}`;
};
