import { Request, Response } from "express";
import MedicationRepo from "../../../database/repository/medicationRepo";
import { formatResponseRecord } from "../../../utils/formatters";
import APIResponse from "../../../utils/api";

const findAllMedicationsHandler = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortType = -1,
      search,
      ...rest
    } = req.query;

    // Enforce user-specific filtering for non-admins
    const filter = {
      ...rest,
      ...(res.locals.user.role !== "admin" && {
        userId: res.locals.user._id,
      }),
    };

    const sortLogic = {
      [sortField as string]: typeof sortType === "string" ? sortType : Number(sortType),
    };

    const limitNum = Math.max(1, Number(limit)); // Ensure limit is at least 1
    const pageNum = Math.max(1, Number(page)); // Ensure page is at least 1

    // Fetch medications
    const medications = await MedicationRepo.findAll(limitNum, pageNum, {
      filter,
      search: search as string,
      sortLogic,
    });

    if (!medications.length) {
      return APIResponse.error("No medications found", 404).send(res);
    }

    // Format response and calculate pagination
    const response = medications.map((medication) =>
      formatResponseRecord(medication)
    );

    const totalCount = medications.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    return APIResponse.success(
      "Medications fetched successfully", 
      {
        medications: response,
        pagination: {
          totalMedications: totalCount,
          currentPage: pageNum,
          totalPages,
          limit: limitNum,
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default findAllMedicationsHandler;