import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { librarianServiceCD } from "../services/librarianCDService";
import { UserRole } from "../common/enums/user";
import { useEffect, useState } from "react";
import { IUser } from "../common/interfaces/User";
import usePagination from "./usePagination";
import { ShowUserPage } from "../common/enums/Page";

const useCDLibrarian = () => {
  const { contextState } = useContextState();
  const [userStatus, setUserStatus] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState(UserRole.BASIC);
  const [users, setUsers] = useState<IUser[]>([]);
  const { goToNextPage, goToPreviousPage, setCurrentPage, currentPage } =
    usePagination();

  const CDLibrarianConst = { userStatus, selectedRole, users, setUserStatus };
  const paginationConst = {
    currentPage,
    setSelectedRole,
    setTotalPages,
    totalPages,
    setUserStatus,
    goToNextPage,
    goToPreviousPage,
  };

  const fetchUsers = async () => {
    try {
      const data = await librarianServiceCD.getUsersByRole(
        selectedRole,
        currentPage,
      );

      if (data.length > 0) {
        setUsers(data);
        calculateTotalPages();
        const librarianEmails = data
          .filter((user) => user.role !== UserRole.BASIC)
          .map((user) => user.email);
        setUserStatus(librarianEmails);
      }
    } catch (error) {
      setUsers([]);
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleAddLibrarian = async (user: IUser) => {
    try {
      const response = await librarianServiceCD.addLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role !== UserRole.BASIC) {
        setUserStatus([...userStatus, user.email]);
        Alert.alert(`Bibliotecario ${user.email} agregado con éxito`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const handleDeleteLibrarian = async (user: IUser) => {
    try {
      const response = await librarianServiceCD.deleteLibrarian(
        user.email,
        contextState.accessToken as string,
      );
      if (response.role === UserRole.BASIC) {
        setUserStatus(userStatus.filter((email) => email !== user.email));
        Alert.alert(`Bibliotecario ${user.email} eliminado con éxito`);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  const calculateTotalPages = async () => {
    try {
      const response =
        await librarianServiceCD.countOfUsersByRole(selectedRole);
      if (response != null) {
        const total = Math.ceil(response.totalUsers / ShowUserPage.PAGE_SIZE);
        setTotalPages(total - 1);
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`${error}`);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchUsers();
  }, [selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return {
    handleAddLibrarian,
    handleDeleteLibrarian,
    fetchUsers,
    setCurrentPage,
    CDLibrarianConst,
    paginationConst,
  };
};

export default useCDLibrarian;
