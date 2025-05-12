# Control 361

Painel de controle responsivo para rastreamento de veículos.

## Tecnologias

. Frontend: React + TypeScript

. Estilização: Tailwind CSS

. Testes: Jest, React Testing Library, Cypress

. CI/CD: GitHub Actions, Vercel

## Estrutura de Pastas
```js
src/
├── _fixtures_/      
├── api/             
│   └── _tests_/     
├── assets/          
├── components/     
│   ├── Button/
│   │   └── _tests_/
│   ├── ControlVehicle/
│   │   └── _tests_/
│   ├── Header/
│   ├── InfoWindowContent/
│   │   └── _tests_/
│   ├── Map/
│   │   └── _tests_/
│   ├── SearchInput/
│   │   └── _tests_/
│   └── Table/
│   │   └── _tests_/
├── hooks/
│   │   └── _tests_/      
├── lib/             
├── pages/          
│   ├── Home/
│   │   └── _tests_/
│   └── Veiculos/
│   │   └── _tests_/
├── services/        
├── types/           
├── App.css          
├── App.tsx          
├── index.css        
├── main.tsx         
├── setupTests.ts    
└── vite-env.d.ts    
```
## 🧪 End-to-End & Integração / Cypress

```js
# abre o cypress em modo interativo (com interface)
npm run cy:open
# ou
yarn cy:open

# executa headless (SEM interface), útil para CI
npm run cy:run
# ou
yarn cy:run
```
## 🔄 CI/CD via GitHub Actions

O pipeline está definido em .github/workflows/ci-cd.yml e segue estes passos:


---> Trigger: em push na branch main (ou manual via workflow_dispatch).

---> Checkout: obtém o código atual do repositório.

---> Setup Node.js: instala a versão 18 do Node.

---> Install dependencies: executa npm ci.

---> Lint: roda npm run lint e falha em warnings (via --max-warnings=0).

---> Test: executa testes unitários e componentes (npm test).

---> Build: gera o build de produção (npm run build).

---> Deploy: usa o Vercel CLI para publicar (vercel deploy --prod --yes ...).

## 🚀 Build & Deploy

. Build: npm run build gera a pasta de produção em dist.

. Deploy: feito automaticamente pela GitHub Actions em pushes na main.
