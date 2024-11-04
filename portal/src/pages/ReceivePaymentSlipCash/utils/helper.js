import { FIELD_NOT_DISABLED } from './constants';

export const fieldDisableToEdit = (field) => !FIELD_NOT_DISABLED.includes(field);
