import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('Clean Architecture Rules', () => {
  it('core does not depend on outer layers', () => {
    const rule = filesOfProject()
      .inFolder('src/core')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/application')
      .inFolder('src/infrastructure')
      .inFolder('src/presentation');

    return expect(rule).toPassAsync();
  });

  it('application does not depend on infrastructure or presentation', () => {
    const rule = filesOfProject()
      .inFolder('src/application')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/infrastructure')
      .inFolder('src/presentation');

    return expect(rule).toPassAsync();
  });

  it('infrastructure can depend on application and core', () => {
    const rule = filesOfProject()
      .inFolder('src/infrastructure')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/presentation');

    return expect(rule).toPassAsync();
  });

  it('presentation only depends on application', () => {
    const rule = filesOfProject()
      .inFolder('src/presentation')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/core')
      .inFolder('src/infrastructure');

    return expect(rule).toPassAsync();
  });

  it('should not have circular dependencies', () => {
    const rule = filesOfProject().inFolder('src').should().beFreeOfCycles();

    return expect(rule).toPassAsync();
  });
});
