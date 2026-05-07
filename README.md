# 📦 COEXP Insumos

Aplicativo mobile de gestão de insumos desenvolvido em **React Native com Expo** para a  COEXP. Permite registrar entradas e saídas de insumos, consultar saldos e gerenciar acessos de usuários.

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| **Login** | Autenticação do usuário com campos de usuário e senha |
| **Insumos** | Lista geral de insumos com saldo atual e atalhos para movimentação |
| **Detalhes do Insumo** | Histórico de movimentações (entradas e saídas) de um insumo específico |
| **Registrar Entrada** | Formulário para registrar entrada de insumo com data, fornecedor e responsável |
| **Registrar Saída** | Formulário para registrar saída de insumo com data, destino/setor e responsável |
| **Gestão de Acessos** | Criação de usuários e gerenciamento de permissões (Padrão / Admin) |

> ⚠️ Esta versão implementa apenas as interfaces visuais. Não há persistência de dados, autenticação real ou regras de negócio.

---

## 🗂️ Estrutura do Projeto

```
coexp-app/
├── App.js                          # Navegação principal (React Navigation)
├── index.js                        # Entry point
├── package.json
└── src/
    ├── theme.js                    # Cores, tipografia e espaçamentos globais
    ├── components/
    │   └── UI.js                   # Componentes reutilizáveis (inputs, botões, tabelas)
    └── screens/
        ├── LoginScreen.js
        ├── InsumosScreen.js
        ├── DetalhesInsumoScreen.js
        ├── RegistrarEntradaScreen.js
        ├── RegistrarSaidaScreen.js
        └── GestaoAcessosScreen.js
```

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

```
cd coexp-app
npm install
npx expo start
```

Escaneie o QR Code exibido no terminal com o **Expo Go** (Android) ou com a câmera do iPhone (iOS).

Para limpar o cache caso haja erros:
```bash
npx expo start --clear
```

---

## 📦 Dependências Principais

| Pacote | Uso |
|--------|-----|
| `expo` | Plataforma base |
| `react-native` | Framework mobile |
| `@react-navigation/native` | Sistema de navegação entre telas |
| `@react-navigation/native-stack` | Navegação em pilha (stack) |
| `react-native-safe-area-context` | Área segura (notch, barra de status) |
| `react-native-screens` | Otimização de telas nativas |
| `@react-native-community/datetimepicker` | Seletor de data nativo (Android/iOS) |

---
## 👥 Autores

Desenvolvido como projeto acadêmico para a disciplina de desenvolvimento mobile — COEXP.
