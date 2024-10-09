import * as React from 'react';
import {
  Html,
  Head,
  Text,
  Section,
  Body,
  Row,
  Column,
  Img,
  Link,
  Heading,
  CodeInline,
  Container,
} from '@react-email/components';

interface Props {
  name: string;
  code: string;
}

const TemplateOTP: React.FC<Props> = ({ name, code }) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section style={{ marginTop: 16, marginBottom: 16 }}>
            <Section
              style={{
                marginTop: 32,
                textAlign: 'center',
              }}
            >
              <Heading
                as="h1"
                style={{
                  margin: '0px',
                  marginTop: 8,
                  fontSize: 36,
                  lineHeight: '36px',
                  fontWeight: 600,
                  color: 'rgb(17,24,39)',
                }}
              >
                reset password code
              </Heading>

              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'rgb(107,114,128)',
                }}
              >
                Hi {name},
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'rgb(107,114,128)',
                }}
              >
                We’ve received a request to reset your password. To proceed,
                please use the following One-Time code (OTP) to complete the
                verification process:
              </Text>
              <Text
                style={{
                  marginTop: 16,
                  marginBottom: 16,
                  fontSize: 18,
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(88, 89, 89)',
                }}
              >
                Your OTP Code:{' '}
                <CodeInline style={{ color: 'rgb(160, 9, 198)' }}>
                  {code}
                </CodeInline>
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'rgb(107,114,128)',
                }}
              >
                This code is valid for one-time use. Please enter it on the
                verification page to proceed. If you did not request this code,
                please ignore this email or contact our support team
                immediately.
              </Text>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  lineHeight: '24px',
                  color: 'rgb(107,114,128)',
                }}
              >
                Thank you for helping us keep your account secure!
              </Text>
            </Section>
          </Section>
          <Section style={{ textAlign: 'center' }}>
            <table style={{ width: '100%' }}>
              <tr style={{ width: '100%' }}>
                <td align="center">
                  <Img
                    alt="React Email logo"
                    height="42"
                    src="https://github.com/franklinserif/link.to-api/blob/develop/assets/logo.png?raw=true"
                  />
                </td>
              </tr>
              <tr style={{ width: '100%' }}>
                <td align="center">
                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 8,
                      fontSize: 16,
                      lineHeight: '24px',
                      fontWeight: 600,
                      color: 'rgb(17,24,39)',
                    }}
                  >
                    LinkTo corporation
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      marginBottom: '0px',
                      fontSize: 16,
                      lineHeight: '24px',
                      color: 'rgb(107,114,128)',
                    }}
                  >
                    Think different
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TemplateOTP;
