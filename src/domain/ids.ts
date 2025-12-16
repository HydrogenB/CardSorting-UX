import { nanoid } from 'nanoid';

const ID_LENGTH = 10;

export function generateTemplateId(): string {
  return `tmpl_${nanoid(ID_LENGTH)}`;
}

export function generateCategoryId(): string {
  return `cat_${nanoid(ID_LENGTH)}`;
}

export function generateCardId(): string {
  return `card_${nanoid(ID_LENGTH)}`;
}
