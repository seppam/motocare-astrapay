export interface ServiceItem {
  id: string;
  name: string;
  icon: 'water' | 'construct' | 'build' | 'flash'; // Restrict to specific icon names
  description: string;
  estimatedPrice: string;
  estimatedTime: string;
  priceValue: number; // Numeric value for payment computation
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'oli-ganti',
    name: 'Ganti Oli',
    icon: 'water',
    description: 'Penggantian oli mesin & filter oli berkualitas tinggi untuk performa mesin optimal.',
    estimatedPrice: 'Rp 35.000 - 80.000',
    estimatedTime: '15 - 30 menit',
    priceValue: 55000,
  },
  {
    id: 'ban',
    name: 'Service Ban',
    icon: 'construct',
    description: 'Pemeriksaan tekanan angin, perbaikan ban bocor, dan penggantian ban luar/dalam.',
    estimatedPrice: 'Rp 15.000 - 50.000',
    estimatedTime: '15 - 45 menit',
    priceValue: 30000,
  },
  {
    id: 'service-ringan',
    name: 'Service Ringan',
    icon: 'build',
    description: 'Tune-up mesin ringan, pembersihan karburator/injeksi, cek rem, rantai, dan lampu.',
    estimatedPrice: 'Rp 25.000 - 60.000',
    estimatedTime: '30 - 60 menit',
    priceValue: 45000,
  },
  {
    id: 'bebas-anjir',
    name: 'Bebas Anjir',
    icon: 'flash',
    description: 'Paket service lengkap premium & proteksi kelistrikan ekstra anti mogok banjir.',
    estimatedPrice: 'Rp 100.000 - 250.000',
    estimatedTime: '1 - 2 jam',
    priceValue: 175000,
  },
];
