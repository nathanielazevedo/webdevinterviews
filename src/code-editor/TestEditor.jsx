import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTests,
} from '@codesandbox/sandpack-react'

const extendedTest = `import * as matchers from 'jest-extended';
import { add } from './add';

expect.extend(matchers);

describe('jest-extended matchers are supported', () => {
test('adding two positive integers yields a positive integer', () => {
expect(add(1, 2)).toBePositive();
});
});
`

const TestEditor = () => (
  <SandpackProvider
    customSetup={{ dependencies: { 'jest-extended': '^3.0.2' } }}
    files={{ '/extended.test.ts': extendedTest }}
    template='test-ts'
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackTests />
    </SandpackLayout>
  </SandpackProvider>
)

export default TestEditor
