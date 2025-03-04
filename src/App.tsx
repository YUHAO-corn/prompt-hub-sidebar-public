import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookmarkIcon, 
  Sparkles, 
  LightbulbIcon, 
  SearchIcon, 
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  StarIcon
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";

const prompts = [
  { title: "写作助手", tags: ["#写作"], highFreq: true, favorite: true },
  { title: "代码调试", tags: ["#代码"], highFreq: true, favorite: false },
  { title: "学术润色", tags: ["#学术"], highFreq: false, favorite: false },
  { title: "文章大纲", tags: ["#写作", "#工作"], highFreq: false, favorite: false },
  { title: "翻译助手", tags: ["#翻译", "#智能"], highFreq: false, favorite: false },
  { title: "阅读笔记", tags: ["#阅读", "#笔记"], highFreq: false, favorite: false },
  { title: "雅思课程", tags: ["#雅思", "#课程", "#英语"], highFreq: false, favorite: false }
];

const allTags = [...new Set(prompts.flatMap(p => p.tags))];
const TAG_LIMIT = 5;

function App() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [showMoreTags, setShowMoreTags] = useState(false);

  const handleOptimize = () => {
    setOptimizedPrompt(originalPrompt + "（优化后版本）");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Filter prompts based on selected tags
  const filteredPrompts = selectedTags.length > 0
    ? prompts.filter(p => selectedTags.some(tag => p.tags.includes(tag)))
    : prompts;

  const displayedTags = showMoreTags ? allTags : allTags.slice(0, TAG_LIMIT);
  const extraTags = allTags.length > TAG_LIMIT ? allTags.length - TAG_LIMIT : 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[380px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-300" />
              Prompt 管理器
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <PlusIcon size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>添加新提示词</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 p-0 h-12 bg-gray-50">
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 transition-all"
            >
              <BookmarkIcon size={16} className="mr-2" />
              收藏
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 transition-all"
            >
              <Sparkles size={16} className="mr-2" />
              优化
            </TabsTrigger>
            <TabsTrigger 
              value="recommend" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 transition-all"
            >
              <LightbulbIcon size={16} className="mr-2" />
              推荐
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          {activeTab === "favorites" && (
            <div className="p-4 pb-2">
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="搜索提示词..." 
                  className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-indigo-500" 
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {activeTab === "favorites" && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {displayedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-indigo-100 ${
                      selectedTags.includes(tag) 
                        ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200" 
                        : "bg-gray-50 text-gray-700 hover:border-indigo-300"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                
                {extraTags > 0 && (
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onClick={() => setShowMoreTags(!showMoreTags)}
                  >
                    {showMoreTags ? (
                      <span className="flex items-center">
                        收起 <ChevronUpIcon size={14} className="ml-1" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        +{extraTags} <ChevronDownIcon size={14} className="ml-1" />
                      </span>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Tab Contents */}
          <div className="px-4 pb-4">
            <TabsContent value="favorites" className="m-0 mt-2">
              <ScrollArea className="h-[350px] pr-4">
                {filteredPrompts.map((prompt, index) => (
                  <Card key={index} className="mb-3 overflow-hidden hover:shadow-md transition-shadow group">
                    <CardContent className="p-0">
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">{prompt.title}</h3>
                          <div className="flex gap-1 mt-1">
                            {prompt.tags.map(tag => (
                              <span key={tag} className="text-xs text-gray-500">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                        >
                          <span className="flex items-center">
                            插入 <ArrowRightIcon size={14} className="ml-1" />
                          </span>
                        </Button>
                      </div>
                      {prompt.favorite ? (
                        <div className="bg-blue-50 py-1 px-3 text-xs text-blue-700 flex items-center">
                          <BookmarkIcon size={12} className="mr-1 text-blue-600 fill-blue-100 stroke-blue-600" /> 收藏
                        </div>
                      ) : prompt.highFreq && (
                        <div className="bg-amber-50 py-1 px-3 text-xs text-amber-700 flex items-center">
                          <Sparkles size={12} className="mr-1" /> 高频使用
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="optimize" className="m-0 mt-2">
              <div className="space-y-3">
                <Textarea 
                  placeholder="请输入需要优化的 prompt..." 
                  value={originalPrompt} 
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="min-h-[120px] bg-gray-50 border-gray-200 focus-visible:ring-indigo-500"
                />
                <Button 
                  onClick={handleOptimize}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <Sparkles size={16} className="mr-2" /> 优化 Prompt
                </Button>
                {optimizedPrompt && (
                  <Card className="mt-4 border-indigo-100 bg-indigo-50">
                    <CardContent className="p-3">
                      <div className="flex items-center text-xs text-indigo-600 mb-2">
                        <Sparkles size={14} className="mr-1" /> 优化结果
                      </div>
                      <p className="text-gray-800">{optimizedPrompt}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                        >
                          <span className="flex items-center">
                            使用此版本 <ArrowRightIcon size={14} className="ml-1" />
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommend" className="m-0 mt-2">
              <div className="h-[350px] flex flex-col items-center justify-center text-center p-4">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <LightbulbIcon size={32} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">智能推荐</h3>
                <p className="text-gray-500 mb-4">根据您的使用习惯，我们将为您推荐更适合的提示词</p>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  功能开发中...
                </Badge>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="User" />
            </Avatar>
            <span className="text-xs text-gray-500">已连接到 AI 助手</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            在线
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default App;