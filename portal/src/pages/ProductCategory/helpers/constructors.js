class MaterialSchema {
  constructor(material_id = null, material_group_name = null, unit_name = null, number = 1, note = null) {
    this.material_id = material_id;
    this.material_group_name = material_group_name;
    this.unit_name = unit_name;
    this.number = number;
    this.note = note;
  }
}

export { MaterialSchema };
