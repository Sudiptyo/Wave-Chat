import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface PasswordResetEmailProps {
  fullName: string;
  resetUrl: string;
}

const PasswordResetEmail = ({
  fullName,
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />

      <Preview>Reset your WaveChat password</Preview>

      <Tailwind>
        <Body className="m-0 bg-[#071b24] px-4 py-10 font-sans">
          <Container className="mx-auto max-w-[520px]">
            <Section className="mb-6 text-center">
              <Text className="m-0 text-[24px] font-bold text-[#f5f2eb]">
                WaveChat
              </Text>
            </Section>

            <Section className="rounded-[28px] border border-white/10 bg-[#0b2430] px-7 py-8">
              <Heading className="m-0 text-center text-[26px] font-semibold tracking-[-0.03em] text-white">
                Reset your password
              </Heading>

              <Text className="mt-3 text-center text-[13px] leading-[21px] text-white/55">
                No worries — it happens to everyone. We'll help you get back
                into your WaveChat account.
              </Text>

              <Text className="mt-7 text-[14px] leading-[22px] text-white/80">
                Hi {fullName},
              </Text>

              <Text className="mt-3 text-[14px] leading-[23px] text-white/60">
                We received a request to reset the password for your WaveChat
                account. Click the button below to choose a new password.
              </Text>

              <Section className="mt-7 text-center">
                <Button
                  href={resetUrl}
                  className="rounded-[12px] bg-[#72d2ad] px-6 py-3 text-[14px] font-semibold text-[#09251f] no-underline"
                >
                  Reset Password
                </Button>
              </Section>

              <Section className="mt-7 rounded-[14px] border border-white/10 bg-[#142d38] px-4 py-3">
                <Text className="m-0 text-center text-[12px] leading-[19px] text-white/55">
                  This password reset link will expire in 15 minutes.
                </Text>
              </Section>

              <Text className="mt-7 text-[12px] leading-[19px] text-white/40">
                If you didn't request a password reset, you can safely ignore
                this email. Your password will remain unchanged.
              </Text>

              <Hr className="my-7 border-white/10" />

              <Text className="m-0 text-[12px] leading-[19px] text-white/45">
                — The WaveChat Team
              </Text>
            </Section>

            <Section className="mt-6 text-center">
              <Text className="m-0 text-[11px] text-white/30">
                This is an automated security email. Please do not reply to this
                message.
              </Text>

              <Text className="mt-2 text-[11px] text-white/20">
                © {new Date().getFullYear()} WaveChat
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
