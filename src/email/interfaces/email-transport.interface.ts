export interface EmailTransport {
  sendMail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void>;
}

export const EmailTransportToken = Symbol('EmailTransport');
