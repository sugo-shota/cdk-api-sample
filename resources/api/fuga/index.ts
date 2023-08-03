export const handler = async (event: any, context: any) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "fuga" }),
  };
};
