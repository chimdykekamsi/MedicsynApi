export const formatResponseRecord = (
  record: any,
  recordType?: any
): any => {
  if (typeof record !== "object" || !record) {
    return record;
  }

  if (record instanceof Date) {
    return record;
  }


  const strippedRecord: Record<string, any> = Object.keys(record).reduce(
    (acc, key) => {
      if (
        typeof record[key] === "object" &&
        record[key] !== null &&
        !/^_/.test(key)
      ) {
        if (Array.isArray(record[key])) {
          return {
            ...acc,
            [key]: record[key].map((nestedRecord: any) =>
              formatResponseRecord(nestedRecord, recordType)
            ),
          };
        }
        return {
          ...acc,
          [key]: formatResponseRecord(record[key], recordType),
        };
      }

      // Exclude private fields and fields starting with underscore
      return  /^_/.test(key)
        ? acc
        : { ...acc, [key]: record[key] };
    },
    {}
  );

  // Map `_id` to `id` if applicable
  strippedRecord.id = record._id || record.id;
  return strippedRecord;
};

export const formatPhoneNumber = (str: string | undefined) => {
  if (!str || str === "undefined" || typeof str !== "string") return "";
  const output = str
    .replace(/[\s|/]/g, "")
    .replace(/^\+?234\(0\)/, "0")
    .replace(/^\+?2340*/, "0");
  console.log(output);
  return output;
};
