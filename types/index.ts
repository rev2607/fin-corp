export interface Client {
  id: string;
  nameOfCustomer: string;
  nameOfCoApplicant: string;
  contactNumber: string;
  referral: string;
  requiredLoanAmount: string;
  securityInformation: string;
  loginBankName: string;
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RootStackParamList = {
  Dashboard: undefined;
  ClientList: undefined;
  NewClient: undefined;
  EditClient: { clientId: string };
  ClientDetail: { clientId: string };
};

