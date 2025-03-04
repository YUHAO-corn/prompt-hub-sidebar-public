import { useState, useEffect } from "react";
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
  StarIcon,
  Check
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
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [displayedOptimizedPrompt, setDisplayedOptimizedPrompt] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    // 在实际应用中，这里应该调用API来获取AI优化后的结果
    // 以下是模拟的优化结果，仅用于前端开发测试
    const sampleOptimizations = [
      "请详细描述您的需求，包括目标受众、核心信息和预期效果，以便我能提供最准确的帮助。",
      "作为一名专业的内容创作者，我需要了解您项目的具体背景、目标和限制条件，以便为您提供最有价值的建议。",
      "为了更好地协助您完成任务，请提供相关的上下文信息、参考资料和您期望的输出格式。"
    ];
    
    if (!originalPrompt.trim()) {
      setOptimizedPrompt("请先输入需要优化的prompt内容");
      setDisplayedOptimizedPrompt("请先输入需要优化的prompt内容");
      return;
    }
    
    // 立即开始第一阶段动画
    setIsOptimizing(true);
    setOptimizedPrompt("");
    setDisplayedOptimizedPrompt("");
    setTypingIndex(0);
    // 直接设置为第一阶段，不使用初始阶段0
    setAnimationPhase(1);
    
    // 模拟多阶段优化过程，延长各阶段展示时间
    setTimeout(() => {
      setAnimationPhase(2); // 第二阶段动画
      
      setTimeout(() => {
        setAnimationPhase(3); // 第三阶段动画
        
        setTimeout(() => {
          // 随机选择一个优化结果
          const index = originalPrompt.length % sampleOptimizations.length;
          const result = sampleOptimizations[index];
          setOptimizedPrompt(result);
          
          setTimeout(() => {
            setIsOptimizing(false);
          }, 800);
        }, 1000);
      }, 1000);
    }, 800);
  };

  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 打字机效果
  useEffect(() => {
    if (!isOptimizing && optimizedPrompt && typingIndex < optimizedPrompt.length) {
      const timer = setTimeout(() => {
        setDisplayedOptimizedPrompt(optimizedPrompt.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 30); // 每个字符的打字速度
      return () => clearTimeout(timer);
    }
  }, [typingIndex, optimizedPrompt, isOptimizing]);

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
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <div className="w-[380px] bg-white rounded-lg shadow-sm overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-white border-b border-[#e0e0e0] p-4 text-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Sparkles size={18} className="text-[#4573d2]" />
              Prompt 管理器
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 rounded-full">
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
          <TabsList className="grid grid-cols-3 p-0 h-12 bg-white border-b border-[#e0e0e0]">
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#4573d2] data-[state=active]:text-[#4573d2] transition-all"
            >
              <BookmarkIcon size={16} className="mr-2" />
              收藏
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#4573d2] data-[state=active]:text-[#4573d2] transition-all"
            >
              <Sparkles size={16} className="mr-2" />
              优化
            </TabsTrigger>
            <TabsTrigger 
              value="recommend" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#4573d2] data-[state=active]:text-[#4573d2] transition-all"
            >
              <LightbulbIcon size={16} className="mr-2" />
              推荐
            </TabsTrigger>
          </TabsList>

          {/* Search and Tags Container - 保持固定高度 */}
          <div className="min-h-[108px]">
            {activeTab === "favorites" ? (
              <>
          {/* Search */}
          <div className="p-4 pb-2">
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="搜索提示词..." 
                      className="pl-9 bg-white border-[#e0e0e0] focus-visible:ring-[#4573d2] rounded-md" 
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {displayedTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer rounded-md ${
                    selectedTags.includes(tag) 
                            ? "bg-[#edf2fc] text-[#4573d2] hover:bg-[#e3ebfa] border-[#d1ddf7]" 
                            : "bg-white text-gray-700 hover:border-[#4573d2] border-[#e0e0e0]"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              
              {extraTags > 0 && (
                <Badge 
                  variant="outline" 
                        className="cursor-pointer bg-white border-[#e0e0e0] hover:bg-gray-50 rounded-md"
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
              </>
            ) : null}
          </div>

          {/* Tab Contents */}
          <div className="px-4 pb-4">
            <TabsContent value="favorites" className="m-0 mt-2">
              <ScrollArea className="h-[350px] pr-4">
                {filteredPrompts.map((prompt, index) => (
                  <Card key={index} className="mb-3 overflow-hidden hover:shadow-sm transition-shadow border-[#e0e0e0] rounded-lg group">
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
                          className="bg-white text-[#4573d2] border border-[#e0e0e0] hover:bg-[#f8f9fc] group-hover:bg-[#4573d2] group-hover:text-white transition-colors"
                        >
                          <span className="flex items-center">
                            插入 <ArrowRightIcon size={14} className="ml-1" />
                          </span>
                        </Button>
                      </div>
                      {prompt.favorite ? (
                        <div className="bg-[#edf2fc] py-1 px-3 text-xs text-[#4573d2] flex items-center border-t border-[#d1ddf7]">
                          <BookmarkIcon size={12} className="mr-1 text-[#4573d2] fill-[#d1ddf7] stroke-[#4573d2]" /> 收藏
                        </div>
                      ) : prompt.highFreq && (
                        <div className="bg-[#fff8e6] py-1 px-3 text-xs text-[#d48806] flex items-center border-t border-[#faedb8]">
                          <Sparkles size={12} className="mr-1" /> 高频使用
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="optimize" className="m-0 mt-2">
              <div className="space-y-3 h-[350px] overflow-y-auto">
                <Textarea 
                  placeholder="请输入需要优化的 prompt..." 
                  value={originalPrompt} 
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="min-h-[120px] bg-white border-[#e0e0e0] focus-visible:ring-[#4573d2] rounded-md"
                />
                <Button 
                  onClick={handleOptimize}
                  className="w-full bg-[#4573d2] hover:bg-[#3a62b3] text-white"
                >
                  <Sparkles size={16} className="mr-2" /> 优化 Prompt
                </Button>
                {optimizedPrompt && (
                  <Card className="mt-4 border-[#d1ddf7] bg-[#f8f9fc] rounded-lg overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-xs text-[#4573d2] mb-2">
                        <div className="flex items-center">
                        <Sparkles size={14} className="mr-1" /> 优化结果
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 rounded-full"
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <ArrowRightIcon size={14} className="text-[#4573d2]" />
                          )}
                        </Button>
                      </div>
                      
                      {isOptimizing ? (
                        <div className="flex flex-col items-center justify-center py-6 min-h-[100px]">
                          {animationPhase === 1 && (
                            <div className="flex flex-col items-center transition-all duration-500 opacity-100">
                              <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-[#4573d2] animate-spin mb-3"></div>
                              <p className="text-sm text-gray-500">分析提示词结构...</p>
                            </div>
                          )}
                          
                          {animationPhase === 2 && (
                            <div className="flex flex-col items-center transition-all duration-500 opacity-100">
                              <div className="w-16 h-16 bg-[#edf2fc] rounded-full animate-pulse flex items-center justify-center mb-3 relative animate-glow">
                                <Sparkles size={24} className="text-[#4573d2] animate-float" />
                                <div className="absolute -inset-1 rounded-full border-2 border-[#4573d2] opacity-75 animate-ping"></div>
                              </div>
                              <p className="text-sm text-gray-500 animate-pulse">AI魔法生成中...</p>
                            </div>
                          )}
                          
                          {animationPhase === 3 && (
                            <div className="text-center transition-all duration-300 opacity-100">
                              <div className="relative mb-3">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#4573d2] to-[#6a8fd8] rounded-full blur opacity-30 animate-pulse"></div>
                                <div className="relative bg-white rounded-full p-3 flex items-center justify-center animate-glow">
                                  <Sparkles size={24} className="text-[#4573d2] animate-float" />
                                </div>
                              </div>
                              <p className="text-sm font-medium text-[#4573d2] mb-2">优化完成!</p>
                              <div className="flex space-x-2 justify-center">
                                <div className="w-2 h-2 bg-[#4573d2] rounded-full animate-ping"></div>
                                <div className="w-2 h-2 bg-[#4573d2] rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-[#4573d2] rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-white rounded-md p-3 border border-[#e0e0e0] min-h-[100px]">
                          {displayedOptimizedPrompt.split('').map((char, index) => (
                            <span 
                              key={index} 
                              className="inline-block animate-fade-in"
                              style={{ animationDelay: `${index * 20}ms` }}
                            >
                              {char}
                            </span>
                          ))}
                          <span className={typingIndex < optimizedPrompt.length ? "inline-block w-1 h-4 bg-[#4573d2] ml-1 animate-pulse" : "hidden"}></span>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-3 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-[#4573d2] border-[#d1ddf7] hover:bg-[#edf2fc] bg-white"
                          onClick={() => setOriginalPrompt(optimizedPrompt)}
                          disabled={isOptimizing || typingIndex < optimizedPrompt.length}
                        >
                          <span className="flex items-center">
                            继续优化 <Sparkles size={14} className="ml-1" />
                          </span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-[#4573d2] border-[#d1ddf7] hover:bg-[#edf2fc] bg-white"
                          disabled={isOptimizing || typingIndex < optimizedPrompt.length}
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
                <div className="bg-[#f8f9fc] p-4 rounded-full mb-4">
                  <LightbulbIcon size={32} className="text-[#d48806]" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">智能推荐</h3>
                <p className="text-gray-500 mb-4">根据您的使用习惯，我们将为您推荐更适合的提示词</p>
                <Badge variant="outline" className="bg-[#fff8e6] text-[#d48806] border-[#faedb8]">
                  功能开发中...
                </Badge>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="bg-[#f8f9fc] p-3 border-t border-[#e0e0e0] flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2 border border-[#e0e0e0]">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="User" />
            </Avatar>
            <span className="text-xs text-gray-500">已连接到 AI 助手</span>
          </div>
          <Badge variant="outline" className="bg-[#e6f7ee] text-[#52c41a] border-[#b7eb8f]">
            在线
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default App;