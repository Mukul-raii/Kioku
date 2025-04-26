import { useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, BookOpen, Eye, BarChart3, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import TailwindAdvancedEditor from "../textEditor";
import { LearningLogWithStats } from "@repo/types";

export default function MyNotes({
  isTable,
  Data,
}: {
  isTable: boolean;
  Data: LearningLogWithStats[];
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [showNotesData,setShowNotesData ] = useState<string | null>(null);
  
  const getRetentionColor = (retention:number) => {
    const retentionValue = retention || 0;
    if (retentionValue >= 80) return "text-green-500";
    if (retentionValue >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="my-10">
      {isTable ? (
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[100px] font-bold text-gray-800 dark:text-gray-200">
                  Title
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-200">
                  Category
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-200">
                  SubTopic
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-200">
                  Retention
                </TableHead>
                <TableHead className="text-right font-bold text-gray-800 dark:text-gray-200">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Data &&
                Data.map((item) => {
                  const retentionClass = getRetentionColor(item.retention ?? 0);
                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.topic}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Layers size={16} className="text-blue-500" />
                        {item.category}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Layers size={16} />
                          {item.totalSubTopic}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-2 ${retentionClass} font-medium`}
                        >
                          <BarChart3 size={16} />
                          {item.retention ? item.retention + "%" : "0%"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                          onClick={() => {
                            setShowNotesData(item.notes);
                            setIsNotesOpen(true);
                          }}
                        >
                          <Eye size={16} className="mr-2" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Data &&
            Data.map((item, index) => {
              const isHovered = hoveredCard === index;
              const retentionValue = item.retention || 0;
              const retentionClass = getRetentionColor(retentionValue);

              return (
                <Card
                  key={item.id}
                  className={`w-full border  border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${
                    isHovered ? "transform -translate-y-2" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="pb-2">
                    <div className="  gap-2 truncate">
                      <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 ">
                        {item.topic}
                      </CardTitle>
                    </div>

                    <CardDescription className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Layers size={16} className="text-blue-500" />
                      {item.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Layers size={16} className="text-indigo-500" />
                          SubTopic:
                        </p>
                        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-md text-sm font-medium">
                          {item.totalSubTopic || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <BarChart3 size={16} className={retentionClass} />
                          Retention:
                        </p>
                        <span
                          className={`${
                            retentionValue >= 80
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : retentionValue >= 50
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          } px-2 py-1 rounded-md text-sm font-medium`}
                        >
                          {retentionValue}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors"
                      onClick={() => {
                        setShowNotesData(item.notes);
                        setIsNotesOpen(true);
                      }}
                    >
                      <BookOpen size={16} />
                      Open Notes
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}

      {showNotesData !== null && (
        <Dialog
          open={isNotesOpen}
          onOpenChange={(open) => {
            setIsNotesOpen(open);
            if (!open) setShowNotesData(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notes</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Here are the notes for this question:
            </DialogDescription>
            <ScrollArea className="h-64 w-full">
              <TailwindAdvancedEditor
                value={showNotesData}
                onChange={() => {}}
              />
            </ScrollArea>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsNotesOpen(false);
                  setShowNotesData(null);
                  window.localStorage.removeItem("novel-content");
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
