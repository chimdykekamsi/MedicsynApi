import { DocumentType } from "@typegoose/typegoose";
import MedicationModel, { Medication } from "../models/medication";

export default class MedicationRepo {
  /**
   * Create a new medication entry.
   * @param medication - Medication object to create.
   * @returns The created medication document.
   */
  static async createMedication(
    medication: Medication
  ): Promise<DocumentType<Medication>> {
    return await MedicationModel.create(medication);
  }

  /**
   * Count medications based on a filter.
   * @param filter - The filter object.
   * @returns The count of medications.
   */
  static async countMedications(filter: Object): Promise<number> {
    return await MedicationModel.countDocuments(filter);
  }

  /**
   * Find a medication by ID.
   * @param id - The ID of the medication.
   * @returns The medication document, or null if not found.
   */
  static async findById(id: string): Promise<DocumentType<Medication> | null> {
    return await MedicationModel.findById(id);
  }

  /**
   * Update a medication entry.
   * @param updateParams - Partial medication data to update.
   * @param id - The ID of the medication to update.
   * @returns The updated medication document, or null if not found.
   */
  static async updateMedication(
    updateParams: Partial<Medication>,
    id: string
  ): Promise<Medication | null> {
    return await MedicationModel.findByIdAndUpdate(id, updateParams, {
      new: true,
    }).lean();
  }

  /**
   * Find all medications with pagination, filtering, and sorting.
   * @param limit - The number of records to fetch.
   * @param page - The page number.
   * @param options - Additional options like filter, sort logic, and search.
   * @returns A list of medications.
   */
  static async findAll(
    limit: number,
    page: number,
    options: {
      filter?: Object;
      sortLogic?: {};
      search?: string;
    }
  ): Promise<Medication[]> {
    const { filter = {}, sortLogic = { createdAt: -1 }, search } = options;

    const queryFilter = {
      ...filter,
      ...(search ? { name: { $regex: search, $options: "i" } } : {}),
    };

    return await MedicationModel.find(queryFilter)
      .populate("userId", "name email")
      .sort(sortLogic)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  }

  /**
   * Delete a medication entry by ID.
   * @param id - The ID of the medication to delete.
   * @returns The deleted medication document, or null if not found.
   */
  static async deleteMedication(
    id: string
  ): Promise<DocumentType<Medication> | null> {
    return await MedicationModel.findByIdAndDelete(id);
  }
}
