export const generateTrackingId = async (): Promise<string> => {
    const datePart = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${datePart}-${randomPart}`;
};