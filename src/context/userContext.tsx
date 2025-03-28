import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import Swal from "sweetalert2";
import { Usuario } from "../types/userType";
import { useNavigate } from "react-router-dom";

interface UserContextInterface {
  usuarios: Usuario[];
  loading: boolean;
  getUsers: () => void;
  createUsuario: (e: React.FormEvent) => Promise<void>;
  login: (e: React.FormEvent) => Promise<void>;
  deleteUser: (id: string) => void;
  updateUser: (id: string) => void
  setNome: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setSenha: Dispatch<SetStateAction<string>>;
  setIdUser: Dispatch<SetStateAction<string | undefined>>;
  idUser: string | undefined
}

export const UserContext = createContext<UserContextInterface>(
  {} as UserContextInterface
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [idUser, setIdUser] = useState<string | undefined>();
  const navigate = useNavigate();

  async function getUsers() {
    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const resultado = await fetch("http://localhost:3000/usuarios", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if(!resultado.ok){
        Swal.fire({
          icon: "error",
          title: `Erro: ${resultado.status}`,
          text: ` ${resultado.statusText} `
        })
        return
      }

      const data = await resultado.json();
      setUsuarios(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Erro no servidor",
          text: error.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro desconhecido",
          text: "Algo deu errado.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function createUsuario(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      nome: nome,
      email: email,
      senha: senha,
    };

    try {
      const resultado = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resultado.ok) {
        Swal.fire({
          icon: "error",
          title: `Erro ${resultado.status} `,
          text: ` ${resultado.statusText} `,
        });
        return;
      }

      const data = await resultado.json();
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Usuario criado",
          text: `${data.mensagem} `,
        }).then(() => {
          navigate("/login"); 
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro ao criar usuario",
          text: "Não foi possivel criar usuario",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Erro no servidor",
          text: error.message,
        });
        console.error("Erro:", error.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro desconhecido",
          text: "Algo deu errado.",
        });
        console.error("Erro desconhecido:", error);
      }
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      email,
      senha,
    };

    try {
      const result = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!result.ok) {
        Swal.fire({
          icon: "error",
          title: `Erro ${result.status}`,
          text: `${result.statusText}`,
        });
        return;
      }

      const data = await result.json();
      if (data.token) {
        localStorage.setItem("token", data.token); // Armazena o token no localStorage
        Swal.fire({
          icon: "success",
          title: "Login bem-sucedido!",
          text: ` ${data.mensagem} `,
        }).then(() => {
          navigate("/usuarios"); // Redireciona após o login
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Falha no login",
          text: "Não foi possível autenticar o usuário.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Erro no servidor",
          text: error.message,
        });
        console.error("Erro:", error.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro desconhecido",
          text: "Algo deu errado.",
        });
        console.error("Erro desconhecido:", error);
      }
    }
  }

  async function deleteUser(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "token invalido",
        text: "voce nao tem permição",
      });
    }
    try {
      const resultado = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ active: false }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resultado.ok) {
        Swal.fire({
          icon: "error",
          title: ` ${resultado.status} `,
          text: `${resultado.statusText} `,
        });
      }

      const data = await resultado.json();
      setUsuarios(prevUser => prevUser.filter(u => u.id != id))
      console.log(data);
      if (data) {
        Swal.fire({
          icon: "success",
          title: "sucesso ao deletar",
          text: ` ${data.mensagem} `,
        });
      } else {
        {
          Swal.fire({
            icon: "error",
            title: "Erro ao deletar usuario",
            text: "nao foi possivel deletar o usuario",
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Erro no servidor",
          text: error.message,
        });
        console.error("Erro:", error.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro desconhecido",
          text: "Algo deu errado.",
        });
        console.error("Erro desconhecido:", error);
      }
    }
  }

  async function updateUser(id?: string) {
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'id invalido',
        text: 'id nao fornecido ou invalido'
      })
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Token invalido",
        text: "Voce não tem permiçao para acessar essa rota",
      });
    }
    try {
      const payload = {
        nome: nome,
        email: email,
        senha: senha,
      };
      const resultado = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!resultado.ok) {
        Swal.fire({
          icon: "error",
          title: ` ${resultado.status} `,
          text: ` ${resultado.statusText} `,
        });
      }
      const data = await resultado.json();
      setUsuarios(prevUsuario => prevUsuario.map(u => u.id === id ? data : u))
      if (data) {
        Swal.fire({
          icon: "success",
          title: "Usuario editado",
          text: `${data.mensagem}`,
        });
        console.log(data)
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro ao editar",
          text: "Não foi possivel editar o usuario",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "Erro no servidor",
          text: error.message,
        });
        console.error("Erro:", error.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro desconhecido",
          text: "Algo deu errado.",
        });
        console.error("Erro desconhecido:", error);
      }
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  const valor: UserContextInterface = {
    usuarios,
    getUsers,
    loading,
    createUsuario,
    setNome,
    setEmail,
    setSenha,
    login,
    deleteUser,
    updateUser,
    setIdUser,
    idUser
  };

  return <UserContext.Provider value={valor}>{children}</UserContext.Provider>;
};
