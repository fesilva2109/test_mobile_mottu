# Mottu Mobile App

Aplicativo móvel para mapeamento inteligente de pátios de motocicletas, desenvolvido com React Native e Expo.

## Funcionalidades

- **Autenticação**: Login e registro de usuários com validação de senha forte
- **Gerenciamento de Motocicletas**: CRUD completo (Criar, Ler, Atualizar, Deletar)
- **Mapeamento de Pátio**: Visualização em grid com posicionamento das motos
- **Dashboard**: Gráficos de status das motocicletas
- **Tema Escuro/Claro**: Alternância entre modos de visualização
- **Integração com API**: Comunicação com backend Java para persistência de dados

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento e build
- **TypeScript**: Tipagem estática
- **AsyncStorage**: Armazenamento local
- **React Navigation**: Navegação entre telas
- **Lucide React Native**: Ícones
- **ESLint**: Linting e formatação de código

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou Xcode (para iOS)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd mottu_mobile_app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a API:
   - Altere a constante `API_BASE` em `context/AuthContext.tsx` e `hooks/useStorage.ts` para a URL da sua API Java

4. Inicie o servidor de desenvolvimento:
```bash
npx expo start
```

5. Execute no emulador ou dispositivo:
   - Pressione `a` para Android
   - Pressione `i` para iOS
   - Escaneie o QR code com o app Expo Go

## Estrutura do Projeto

```
mottu_mobile_app/
├── app/                    # Telas e navegação
│   ├── _layout.tsx        # Layout principal
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de registro
│   └── (tabs)/            # Navegação por abas
├── components/            # Componentes reutilizáveis
│   ├── MotoList.tsx       # Lista de motocicletas
│   ├── StatusChart.tsx    # Gráfico de status
│   └── ...
├── context/               # Contextos React
│   ├── AuthContext.tsx    # Autenticação
│   └── ThemeContext.tsx   # Tema
├── hooks/                 # Hooks customizados
│   └── useStorage.ts      # Gerenciamento de dados
├── theme/                 # Tema e cores
│   └── colors.ts          # Definição de cores
└── types/                 # Tipos TypeScript
    └── index.ts           # Interfaces
```

## API Endpoints

O aplicativo espera os seguintes endpoints na API:

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/logout` - Logout

### Motocicletas
- `GET /motorcycles` - Listar todas
- `POST /motorcycles` - Criar nova
- `PUT /motorcycles/:id` - Atualizar
- `DELETE /motorcycles/:id` - Deletar

## Funcionalidades Implementadas

- ✅ Autenticação com validação
- ✅ CRUD de motocicletas
- ✅ Mapeamento visual do pátio
- ✅ Dashboard com estatísticas
- ✅ Tema escuro/claro
- ✅ Validação de formulários
- ✅ Navegação intuitiva
- ✅ Armazenamento local
- ✅ Integração com API REST

## Desenvolvimento

### Scripts Disponíveis

- `npm start` - Inicia o servidor Expo
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa na web

### Linting

O projeto utiliza ESLint para manter a qualidade do código:

```bash
npx eslint . --ext .ts,.tsx
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Autor

Desenvolvido como projeto acadêmico para a disciplina de Desenvolvimento Mobile.
