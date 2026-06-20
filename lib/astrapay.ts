/**
 * AstraPay Sandbox API Integration Service
 * Simulates OAuth 2.0 authentication and QRIS code generation flows.
 */

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

interface QRISResponse {
  qrisData: string;
  transactionId: string;
  amount: number;
  createdAt: string;
}

// Read env variables loaded by Expo
const BASE_URL = process.env.EXPO_PUBLIC_ASTRAPAY_SANDBOX_URL || 'https://sandbox.astrapay.com';
const CLIENT_ID = process.env.EXPO_PUBLIC_ASTRAPAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_ASTRAPAY_CLIENT_SECRET;

/**
 * Simulates POST /api/oauth/token
 * Authenticates the client using credentials and returns a Bearer access token
 */
export async function generateToken(): Promise<TokenResponse> {
  console.log(`[AstraPay SDK] Authenticating with ${BASE_URL}/api/oauth/token`);
  console.log(`[AstraPay SDK] Client ID: ${CLIENT_ID ? '✓ Loaded' : '✗ Missing'}`);
  console.log(`[AstraPay SDK] Client Secret: ${CLIENT_SECRET ? '✓ Loaded' : '✗ Missing'}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accessToken: `astrapay_oauth_token_${Math.random().toString(36).substring(2, 15)}`,
        expiresIn: 3600,
        tokenType: 'Bearer',
      });
    }, 1000); // Simulate network latency
  });
}

/**
 * Simulates POST /api/v1/qris/generate
 * Generates a mock QRIS EMVCo-compliant payload string for the booking amount
 */
export async function generateQRIS(
  token: string,
  amount: number,
  bookingId: string
): Promise<QRISResponse> {
  console.log(`[AstraPay SDK] Requesting QRIS code generation for Booking: ${bookingId}`);
  console.log(`[AstraPay SDK] Bearer Token present: ${token ? '✓ Yes' : '✗ No'}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a mock EMVCo QRIS payload format
      // Includes basic tags like 00 (Payload Format), 26 (Merchant Info - AstraPay), 52 (Merchant Category Code), 53 (Currency - IDR), 54 (Amount), etc.
      const paddedAmount = amount.toString();
      const qrisData = `00020101021226630016ID.ASTRAPAY.WWW011893600012345678901252045543530336054${paddedAmount.length.toString().padStart(2, '0')}${paddedAmount}5802ID5917MotoCare AstraPay6007Jakarta6304A5F1`;

      resolve({
        qrisData,
        transactionId: `TXN-ASTRA-${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        createdAt: new Date().toISOString(),
      });
    }, 1200); // Simulate network latency
  });
}
