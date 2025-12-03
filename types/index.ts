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
  followUpCompleted?: boolean; // Track if follow-up is completed
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  nameOfCustomer: string;
  nameOfCoApplicant: string;
  contactNumber: string;
  referral: string;
  requiredLoanAmount: string;
  securityInformation: string;
  loginBankName: string;
  followUpDate: Date | null;
}

export type RootStackParamList = {
  Dashboard: undefined;
  ClientList: undefined;
  NewClient: undefined;
  EditClient: { clientId: string };
  ClientDetail: { clientId: string };
};

