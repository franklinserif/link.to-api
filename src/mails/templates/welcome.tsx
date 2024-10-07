// src/templates/welcome.tsx
import * as React from 'react';
import { Html, Head, Container, Text, Section } from '@react-email/components';

export default function Welcome() {
  return (
    <Html>
      <Head />
      <Section>
        <Container>
          <Text>Hola</Text>
          <Text>
            Gracias por registrarte. Por favor, confirma tu correo electrónico
            haciendo clic en el siguiente enlace:
          </Text>
          <Text>franklinserif@gmail.com</Text>
        </Container>
      </Section>
    </Html>
  );
}
