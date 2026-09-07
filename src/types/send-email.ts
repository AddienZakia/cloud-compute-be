export type sendEmailType = {
  type: "verify" | "reset";
  title: string;
  name: string;
  link: string;
};
