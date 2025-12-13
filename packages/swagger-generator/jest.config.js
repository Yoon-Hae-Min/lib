export default {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/', '/__tests__/output/'],
  passWithNoTests: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    // 👇 수정됨: ts, tsx 뿐만 아니라 js, jsx, mjs까지 Babel이 처리하도록 변경
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' }, modules: false }], // Node 버전 타겟팅 추가 권장
          '@babel/preset-typescript',
        ],
      },
    ],
  },
};
