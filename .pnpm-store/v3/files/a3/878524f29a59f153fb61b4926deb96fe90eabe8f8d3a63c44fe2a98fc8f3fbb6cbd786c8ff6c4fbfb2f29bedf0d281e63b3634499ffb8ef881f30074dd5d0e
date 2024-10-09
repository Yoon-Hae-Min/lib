import * as eslint from 'eslint';
import { Rule } from 'eslint';

interface EnvironmentConfig {
    legacyConfig: Array<string>;
    env: Array<string>;
    passThroughEnv: Array<string> | null;
    dotEnv: DotEnvConfig | null;
}
interface DotEnvConfig {
    filePaths: Array<string>;
    hashes: Record<string, string | null>;
}
interface ProjectKey {
    global: EnvironmentConfig;
    globalTasks: Record<string, EnvironmentConfig>;
    workspaceTasks: Record<string, Record<string, EnvironmentConfig>>;
}

interface RuleContextWithOptions extends Rule.RuleContext {
    options: Array<{
        cwd?: string;
        allowList?: Array<string>;
    }>;
}

declare const rules: {
    [x: string]: {
        create: (context: RuleContextWithOptions) => eslint.Rule.RuleListener;
        meta: eslint.Rule.RuleMetaData;
    };
};
declare const configs: {
    recommended: {
        settings: {
            turbo: {
                cacheKey: number | ProjectKey;
            };
        };
        plugins: string[];
        rules: {
            [x: string]: string;
        };
    };
};

export { configs, rules };
