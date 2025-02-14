import handlebars from 'handlebars';

interface ITemplateVariable {
  [key: string]: string | number;
}

// Fixed interface name (PascalCase)
interface IParseMailTemplate {
  template: string;
  variables: ITemplateVariable;
}

// Fixed class name (PascalCase)
export default class HandlebarsMailTemplate {
  // Keep method name as "parser" (or rename to "parse" if preferred)
  public async parser({ template, variables }: IParseMailTemplate): Promise<string> {
    const parseTemplate = handlebars.compile(template);
    return parseTemplate(variables);
  }
}