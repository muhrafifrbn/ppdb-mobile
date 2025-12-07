// lib/api.ts
type RegisterForm = {
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  sekolah_asal: string;
  alamat: string;
  telepon: string;
  email: string;
  nama_ayah: string;
  nama_ibu: string;
  jurusan: string;
};

export async function registerPPDB(form: RegisterForm): Promise<{
  noPendaftaran: string;
}> {
  // TODO: ganti ke fetch() ke API backend kamu
  // sementara dummy
  await new Promise((r) => setTimeout(r, 800));
  const random = Math.floor(100000 + Math.random() * 900000);
  return { noPendaftaran: `PPDB${random}` };
}

export async function loginPPDB(noPendaftaran: string): Promise<{
  noPendaftaran: string;
  nama: string;
  jurusan?: string;
}> {
  // TODO: ganti ke API login asli
  await new Promise((r) => setTimeout(r, 600));

  // dummy rule: semua yang diawali "PPDB" dianggap valid
  if (!noPendaftaran.startsWith("PPDB")) {
    throw new Error("Nomor pendaftaran tidak ditemukan.");
  }

  return {
    noPendaftaran,
    nama: "Calon Siswa Contoh",
    jurusan: "Rekayasa Perangkat Lunak",
  };
}
