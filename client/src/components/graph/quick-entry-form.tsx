import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quickEntrySchema = z.object({
  contactName: z.string().min(1, "名前を入力してください"),
  location: z.string().min(1, "場所を選択してください"),
  trustRating: z.string().min(1, "信頼度を選択してください"),
  notes: z.string().optional(),
});

type QuickEntryForm = z.infer<typeof quickEntrySchema>;

export default function QuickEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations = [] } = useQuery<string[]>({
    queryKey: ["/api/locations"],
  });

  const form = useForm<QuickEntryForm>({
    resolver: zodResolver(quickEntrySchema),
    defaultValues: {
      contactName: "",
      location: "",
      trustRating: "",
      notes: "",
    },
  });

  const createConnectionMutation = useMutation({
    mutationFn: async (data: QuickEntryForm) => {
      const response = await apiRequest("POST", "/api/quick-entry", {
        contactName: data.contactName,
        location: data.location,
        trustRating: data.trustRating,
        notes: data.notes,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/people"] });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      
      setIsSubmitting(true);
      toast({
        title: "関係を追加しました！",
        description: "新しい人間関係がグラフに追加されました。",
      });

      setTimeout(() => {
        setIsSubmitting(false);
        form.reset();
      }, 2000);
    },
    onError: () => {
      toast({
        title: "エラーが発生しました",
        description: "関係の追加に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuickEntryForm) => {
    createConnectionMutation.mutate(data);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 font-noto-jp">クイック登録</h3>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-noto-jp">
            10秒で完了
          </div>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1 font-noto-jp">
              相手の名前
            </Label>
            <Input
              {...form.register("contactName")}
              placeholder="山田太郎"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
            />
            {form.formState.errors.contactName && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.contactName.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 font-noto-jp">
                場所
              </Label>
              <Select onValueChange={(value) => form.setValue("location", value)}>
                <SelectTrigger className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white">
                  <SelectValue placeholder="選択..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Shibuya">Shibuya</SelectItem>
                  <SelectItem value="Shinjuku">Shinjuku</SelectItem>
                  <SelectItem value="Harajuku">Harajuku</SelectItem>
                  <SelectItem value="Roppongi">Roppongi</SelectItem>
                  {locations.filter(location => !['Tokyo', 'Shibuya', 'Shinjuku', 'Harajuku', 'Roppongi'].includes(location)).map((location: string) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.location && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 font-noto-jp">
                信頼度
              </Label>
              <Select onValueChange={(value) => form.setValue("trustRating", value)}>
                <SelectTrigger className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white">
                  <SelectValue placeholder="評価..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2)</SelectItem>
                  <SelectItem value="1">⭐ (1)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.trustRating && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.trustRating.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1 font-noto-jp">
              メモ（オプション）
            </Label>
            <Input
              {...form.register("notes")}
              placeholder="会議で会いました"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
            />
          </div>
          
          <Button
            type="submit"
            disabled={createConnectionMutation.isPending || isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all transform hover:scale-[1.02] font-noto-jp"
          >
            {isSubmitting ? (
              <>
                <PlusCircle className="mr-2" size={16} />
                追加されました！
              </>
            ) : createConnectionMutation.isPending ? (
              "追加中..."
            ) : (
              <>
                <PlusCircle className="mr-2" size={16} />
                関係を追加
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
