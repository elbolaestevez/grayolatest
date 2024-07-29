"use client";
import { ProjectProps } from "@/types/project";
import {
  DialogFooter,
  DialogHeader,
  DialogClose,
  Button,
  DialogTitle,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "../ui/index";
import { getDesignersEmailsByProject, getAllDesigners } from "@/db/designer";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

interface AssignProjectProps {
  project: ProjectProps;
}
interface User {
  id: number;
  user_id: string;
  role: string;
  email: string;
}

export const AssignForm: React.FC<AssignProjectProps> = ({ project }) => {
  const [designersByProject, setDesignersByProject] = useState<User[]>([]);
  const [designers, setDesigners] = useState<User[]>([]);

  useEffect(() => {
    const fetchDesignersByProject = async () => {
      const designersData = await getDesignersEmailsByProject(project.id);
      if (designersData) {
        setDesignersByProject(designersData);
      } else {
        setDesignersByProject([]);
      }
    };

    fetchDesignersByProject();
  }, [project]);

  useEffect(() => {
    const fetchDesigners = async () => {
      const designersData = await getAllDesigners();
      if (designersData) {
        setDesigners(designersData);
      } else {
        setDesigners([]);
      }
    };

    fetchDesigners();
  }, []);

  const handleSelectDesigner = (designerId: string) => {
    const selectedDesigner = designers.find((d) => d.user_id === designerId);
    if (selectedDesigner) {
      setDesignersByProject((prevDesigners) => {
        const isAlreadyAdded = prevDesigners.some(
          (d) => d.user_id === selectedDesigner.user_id
        );
        if (!isAlreadyAdded) {
          return [...prevDesigners, selectedDesigner];
        }
        return prevDesigners;
      });
    }
  };

  const handleRemoveDesigner = (userId: string) => {
    setDesignersByProject(
      designersByProject.filter((designer) => designer.user_id !== userId)
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Asignar proyecto</DialogTitle>
      </DialogHeader>
      <h2>Ver diseñadores</h2>
      <div className="mt-2 flex flex-wrap gap-1">
        {designersByProject.map((designer) => (
          <div key={designer.user_id} className="flex items-center gap-0.5">
            <Badge key={designer.id}>{designer.email}</Badge>
            <RxCross2 onClick={() => handleRemoveDesigner(designer.user_id)} />
          </div>
        ))}
      </div>
      <Select onValueChange={handleSelectDesigner}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar diseñadores" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Diseñadores</SelectLabel>
            {designers.map((designer) => (
              <SelectItem key={designer.id} value={designer.user_id}>
                {designer.email}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DialogFooter>
        <DialogClose asChild aria-label="Close">
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <DialogClose asChild aria-label="Close">
          <Button>Guardar</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
