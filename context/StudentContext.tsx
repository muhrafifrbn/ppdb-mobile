// context/StudentContext.tsx
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { get, put } from "../lib/api";
import { useAuth } from "./AuthContext";

export type StudentForm = {
  id: number;
  nomor_formulir: string;
  jurusan_dipilih: string;
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
  id_gelombang: number;
};

type StudentContextType = {
  student: StudentForm | null;
  loading: boolean;
  refreshStudent: () => Promise<void>;
  updateStudent: (newData: Partial<StudentForm>) => Promise<void>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentForm | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data formulir
  const fetchStudentData = async () => {
    // Cek apakah user sudah login dan punya nomor_formulir
    if (!user || !user.nomor_formulir) return;

    setLoading(true);
    try {
      console.log("Fetching detail siswa: ", user.nomor_formulir);
      const token = await SecureStore.getItemAsync("auth_token");
      console.log("Token yang digunakan untuk request:", token); // Log token yang digunakan
      console.log("User saved (main):", user); // Log token yang digunakan

      // Endpoint sesuai backend kamu
      // Pastikan backend mereturn data JSON sesuai kolom tabel di atas
      const response = await get(`/regist-form/mobile/detail/${user.id}`);

      // Handle struktur response (jika dibungkus .data atau tidak)
      const data = response?.data || response;

      setStudent(data);
    } catch (error) {
      console.error("Gagal load data siswa:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Update data formulir
  const updateStudent = async (newData: Partial<StudentForm>) => {
    if (!student || !student.id) {
      throw new Error("Data siswa tidak ditemukan, tidak bisa update.");
    }

    try {
      const fullPayload = {
        ...student,
        ...newData,
      };

      console.log("Sending Update Payload:", fullPayload);

      await put(`/regist-form/mobile/update/${student.id}`, fullPayload);

      // Jika sukses, update state lokal agar UI berubah instan
      setStudent(fullPayload);
    } catch (error) {
      console.error("Gagal update data di Context:", error);
      throw error; // Lempar ke UI untuk menampilkan Alert
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  return (
    <StudentContext.Provider
      value={{ student, loading, refreshStudent: fetchStudentData, updateStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentData() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentData must be used within a StudentProvider");
  }
  return context;
}
